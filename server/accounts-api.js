import { randomBytes, pbkdf2Sync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_FILE = process.env.STAYMATE_ACCOUNT_DATA_FILE || resolve(ROOT, "data", "accounts.json");
const PORT = Number(process.env.ACCOUNTS_PORT || 3002);
const HOST = "127.0.0.1";
const ACCOUNT_ROLES = new Set(["student", "owner"]);
const PBKDF2_ITERATIONS = 150000;
const MAX_REQUEST_BYTES = 65536;
let databaseQueue = Promise.resolve();

function normalizeIdentifier(identifier) {
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) return trimmed.toLowerCase();
  let digits = trimmed.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

async function readDatabase() {
  let parsed;
  try {
    parsed = JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { accounts: [] };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || !Array.isArray(parsed.accounts)) {
    throw new Error("Account database is invalid. Restore a valid JSON file before continuing.");
  }
  const invalidAccount = parsed.accounts.some((account) => (
    !account
    || typeof account !== "object"
    || !ACCOUNT_ROLES.has(account.role)
    || typeof account.normalizedIdentifier !== "string"
    || typeof account.salt !== "string"
    || !/^[\da-f]{32}$/i.test(account.salt)
    || typeof account.passwordHash !== "string"
    || !/^[\da-f]{64}$/i.test(account.passwordHash)
    || !account.profile
    || typeof account.profile !== "object"
    || Array.isArray(account.profile)
  ));
  if (invalidAccount) throw new Error("Account database contains invalid account data. Restore a valid JSON file before continuing.");
  return parsed;
}

async function saveDatabase(database) {
  await mkdir(dirname(DATA_FILE), { recursive: true });
  const temporaryFile = `${DATA_FILE}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(database, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporaryFile, DATA_FILE);
}

function updateDatabase(update) {
  const nextWrite = databaseQueue.then(async () => {
    const database = await readDatabase();
    const result = await update(database);
    await saveDatabase(database);
    return result;
  });
  databaseQueue = nextWrite.catch(() => {});
  return nextWrite;
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(body));
}

async function readRequestBody(request) {
  let requestBytes = 0;
  const chunks = [];
  for await (const chunk of request) {
    requestBytes += chunk.length;
    if (requestBytes > MAX_REQUEST_BYTES) throw Object.assign(new Error("Request body is too large."), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON."), { status: 400 });
  }
}

function validateIdentity(body) {
  if (!body || !ACCOUNT_ROLES.has(body.role)) {
    throw Object.assign(new Error("Choose a valid account type."), { status: 400 });
  }
  if (typeof body.identifier !== "string" || !body.identifier.trim()) {
    throw Object.assign(new Error("Email or phone number is required."), { status: 400 });
  }
  const normalizedIdentifier = normalizeIdentifier(body.identifier);
  if (!normalizedIdentifier) throw Object.assign(new Error("Enter a valid email or phone number."), { status: 400 });
  return normalizedIdentifier;
}

function validateProfile(profile) {
  if (
    !profile
    || typeof profile !== "object"
    || Array.isArray(profile)
    || typeof profile.name !== "string"
    || !profile.name.trim()
  ) {
    throw Object.assign(new Error("A valid account profile is required."), { status: 400 });
  }
}

function credentialHash(password, salt) {
  return pbkdf2Sync(password, Buffer.from(salt, "hex"), PBKDF2_ITERATIONS, 32, "sha256");
}

function findAccount(database, role, normalizedIdentifier) {
  return database.accounts.find((account) => (
    account.role === role && account.normalizedIdentifier === normalizedIdentifier
  ));
}

async function registerAccount(body) {
  const normalizedIdentifier = validateIdentity(body);
  if (typeof body.password !== "string" || body.password.length < 6) {
    throw Object.assign(new Error("Password must be at least 6 characters."), { status: 400 });
  }
  validateProfile(body.profile);
  const salt = randomBytes(16).toString("hex");
  const account = {
    role: body.role,
    normalizedIdentifier,
    salt,
    passwordHash: credentialHash(body.password, salt).toString("hex"),
    profile: body.profile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return updateDatabase((database) => {
    if (findAccount(database, body.role, normalizedIdentifier)) {
      throw Object.assign(new Error("An account with this email or phone number already exists. Please log in."), { status: 409 });
    }
    database.accounts.push(account);
    return { profile: account.profile };
  });
}

async function importLegacyAccount(body) {
  const normalizedIdentifier = validateIdentity(body);
  validateProfile(body.profile);
  if (
    body.normalizedIdentifier !== normalizedIdentifier
    || typeof body.salt !== "string"
    || !/^[\da-f]{32}$/i.test(body.salt)
    || typeof body.passwordHash !== "string"
    || !/^[\da-f]{64}$/i.test(body.passwordHash)
  ) {
    throw Object.assign(new Error("Saved account credentials are invalid."), { status: 400 });
  }
  return updateDatabase((database) => {
    const existing = findAccount(database, body.role, normalizedIdentifier);
    if (existing) return { profile: existing.profile };
    database.accounts.push({
      role: body.role,
      normalizedIdentifier,
      salt: body.salt,
      passwordHash: body.passwordHash,
      profile: body.profile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { profile: body.profile };
  });
}

async function authenticateAccount(body) {
  const normalizedIdentifier = validateIdentity(body);
  if (typeof body.password !== "string" || !body.password) {
    throw Object.assign(new Error("Password is required."), { status: 400 });
  }
  await databaseQueue;
  const database = await readDatabase();
  const account = findAccount(database, body.role, normalizedIdentifier);
  if (!account) {
    throw Object.assign(new Error("No account found with these details. Create an account to continue."), { status: 404 });
  }
  const expectedHash = Buffer.from(account.passwordHash, "hex");
  const actualHash = credentialHash(body.password, account.salt);
  if (expectedHash.length !== actualHash.length || !timingSafeEqual(actualHash, expectedHash)) {
    throw Object.assign(new Error("Email/phone number or password is incorrect."), { status: 401 });
  }
  return { profile: account.profile };
}

async function updateAccountProfile(body) {
  const normalizedIdentifier = validateIdentity(body);
  validateProfile(body.profile);
  return updateDatabase((database) => {
    const account = findAccount(database, body.role, normalizedIdentifier);
    if (!account) throw Object.assign(new Error("Account was not found in the saved account file."), { status: 404 });
    account.profile = body.profile;
    account.updatedAt = new Date().toISOString();
    return { profile: account.profile };
  });
}

function allowedOrigin(origin) {
  return !origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;
  if (!allowedOrigin(origin)) {
    sendJson(response, 403, { error: "Account storage is available only to the local StayMate app." });
    return;
  }
  if (origin) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }
  if (request.method === "GET" && request.url === "/api/health") {
    sendJson(response, 200, { ready: true });
    return;
  }

  try {
    const body = await readRequestBody(request);
    let result;
    if (request.method === "POST" && request.url === "/api/accounts/register") result = await registerAccount(body);
    else if (request.method === "POST" && request.url === "/api/accounts/login") result = await authenticateAccount(body);
    else if (request.method === "POST" && request.url === "/api/accounts/migrate") result = await importLegacyAccount(body);
    else if (request.method === "PATCH" && request.url === "/api/accounts/profile") result = await updateAccountProfile(body);
    else {
      sendJson(response, 404, { error: "Account API route was not found." });
      return;
    }
    sendJson(response, 200, result);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "EACCES" || error.code === "EPERM") {
      console.error("Could not access the local account database.", error);
      sendJson(response, 500, { error: "Could not access the local account file. Check file permissions and try again." });
      return;
    }
    if (error instanceof SyntaxError || error.message.includes("Account database")) {
      console.error("Local account database is invalid.", error);
      sendJson(response, 500, { error: error.message });
      return;
    }
    if (error.status) {
      sendJson(response, error.status, { error: error.message });
      return;
    }
    console.error("Account API request failed.", error);
    sendJson(response, 500, { error: "Could not save or read account data. Please try again." });
  }
});

try {
  const database = await readDatabase();
  await saveDatabase(database);
} catch (error) {
  console.error("Could not initialize the local account database.", error);
  process.exitCode = 1;
}

if (process.exitCode !== 1) {
  server.listen(PORT, HOST, () => {
    console.log(`Local account API ready at http://${HOST}:${PORT}`);
    console.log(`Account data file: ${DATA_FILE}`);
  });
}
