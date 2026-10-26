const STUDENT_ACCOUNTS_KEY = "staymateAccounts";
const OWNER_ACCOUNTS_KEY = "staymateOwnerAccounts";
const ACCOUNT_API_URL = import.meta.env.VITE_ACCOUNT_API_URL || "http://127.0.0.1:3002/api/accounts";

function normalizeIdentifier(identifier) {
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) return trimmed.toLowerCase();
  let digits = trimmed.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

function readAccounts(storageKey) {
  let storedAccounts;
  try {
    storedAccounts = localStorage.getItem(storageKey);
  } catch (error) {
    console.error(`Could not read saved accounts for "${storageKey}".`, error);
    throw new Error("Browser storage is unavailable. Check your browser settings and try again.");
  }
  if (!storedAccounts) return [];
  let accounts;
  try {
    accounts = JSON.parse(storedAccounts);
  } catch (error) {
    console.error(`Saved account data for "${storageKey}" is invalid JSON.`, error);
    throw new Error("Saved account data is unreadable. Clear the damaged account data and try again.");
  }
  if (!Array.isArray(accounts)) {
    throw new Error("Saved account data is invalid. Clear browser storage and try again.");
  }
  const hasInvalidAccount = accounts.some((account) => (
    !account
    || typeof account !== "object"
    || typeof account.normalizedIdentifier !== "string"
    || typeof account.salt !== "string"
    || typeof account.passwordHash !== "string"
    || !account.profile
    || typeof account.profile !== "object"
    || Array.isArray(account.profile)
  ));
  if (hasInvalidAccount) {
    throw new Error("Saved account data is invalid. Clear the damaged account data and try again.");
  }
  return accounts;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Secure password storage is unavailable in this browser.");
  }
  const encoder = new TextEncoder();
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await globalThis.crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return new Uint8Array(hash);
}

async function createPasswordRecord(password) {
  if (!globalThis.crypto?.getRandomValues || !globalThis.crypto?.subtle) {
    throw new Error("Secure password storage is unavailable in this browser.");
  }
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const hash = await hashPassword(password, salt);
  return { salt: bytesToHex(salt), passwordHash: bytesToHex(hash) };
}

function hexToBytes(value) {
  if (typeof value !== "string" || value.length % 2 !== 0 || !/^[\da-f]+$/i.test(value)) {
    throw new Error("Saved account credentials are invalid.");
  }
  return Uint8Array.from(value.match(/.{2}/g), (byte) => Number.parseInt(byte, 16));
}

async function requestAccountApi(endpoint, method, body) {
  let response;
  try {
    response = await fetch(`${ACCOUNT_API_URL}/${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const unavailableError = new Error("The local account file service is unavailable. Start StayMate with npm run dev and try again.");
    unavailableError.status = 0;
    unavailableError.cause = error;
    throw unavailableError;
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    console.error("The local account service returned an invalid response.", error);
    throw new Error("The local account service returned an unreadable response.");
  }
  if (!response.ok) {
    const apiError = new Error(result.error || "The account request could not be completed.");
    apiError.status = response.status;
    throw apiError;
  }
  return result;
}

function saveAccounts(storageKey, accounts) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(accounts));
    return true;
  } catch (error) {
    console.error(`Could not save the local account cache for "${storageKey}".`, error);
    return false;
  }
}

async function registerAccount(storageKey, formData, profile) {
  let accounts = [];
  try {
    accounts = readAccounts(storageKey);
  } catch (error) {
    console.error("Could not read the browser account cache; the account file will remain the source of truth.", error);
  }
  const normalizedIdentifier = normalizeIdentifier(formData.identifier);
  if (accounts.some((account) => account.normalizedIdentifier === normalizedIdentifier)) {
    throw new Error("An account with this email or phone number already exists. Please log in.");
  }

  const credentials = await createPasswordRecord(formData.password);
  const account = { normalizedIdentifier, ...credentials, profile };
  const role = storageKey === OWNER_ACCOUNTS_KEY ? "owner" : "student";
  const savedAccount = await requestAccountApi("register", "POST", {
    role,
    identifier: formData.identifier,
    password: formData.password,
    profile,
  });
  accounts.push({ ...account, profile: savedAccount.profile });
  saveAccounts(storageKey, accounts);
  return savedAccount.profile;
}

async function authenticateAccount(storageKey, identifier, password) {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  const role = storageKey === OWNER_ACCOUNTS_KEY ? "owner" : "student";
  let accounts = [];
  let browserCacheError;
  try {
    accounts = readAccounts(storageKey);
  } catch (error) {
    browserCacheError = error;
    console.error("Could not read the browser account cache; checking the local account file.", error);
  }
  const account = accounts.find((item) => item.normalizedIdentifier === normalizedIdentifier);

  try {
    const result = await requestAccountApi("login", "POST", { role, identifier, password });
    if (account) {
      const accountIndex = accounts.indexOf(account);
      accounts[accountIndex] = { ...account, profile: result.profile };
      saveAccounts(storageKey, accounts);
    }
    return result.profile;
  } catch (apiError) {
    if (apiError.status !== 404 && apiError.status !== 0) throw apiError;
    if (browserCacheError) throw browserCacheError;
    if (!account) {
      if (apiError.status === 0) throw apiError;
      throw new Error("No account found with these details. Create an account to continue.");
    }

    const expectedHash = hexToBytes(account.passwordHash);
    const salt = hexToBytes(account.salt);
    const actualHash = await hashPassword(password, salt);
    const matches = actualHash.length === expectedHash.length
      && actualHash.every((byte, index) => byte === expectedHash[index]);
    if (!matches) throw new Error("Email/phone number or password is incorrect.");

    if (apiError.status === 404) {
      try {
        const imported = await requestAccountApi("migrate", "POST", {
          role,
          identifier,
          normalizedIdentifier,
          salt: account.salt,
          passwordHash: account.passwordHash,
          profile: account.profile,
        });
        account.profile = imported.profile;
        saveAccounts(storageKey, accounts);
        return imported.profile;
      } catch (migrationError) {
        if (migrationError.status !== 0) throw migrationError;
        console.error("Could not copy this older browser account to the local account file.", migrationError);
      }
    } else {
      console.warn("Account service is unavailable; signed in using the browser's saved account. This account will sync when the service is available.");
    }
    return account.profile;
  }
}

export async function registerStudent(formData) {
  const profile = {
    name: formData.fullName.trim(),
    college: formData.college.trim(),
    email: formData.identifier.includes("@") ? formData.identifier.trim() : "",
    phone: formData.identifier.includes("@") ? "" : formData.identifier.trim(),
    course: "",
    age: "",
    food: "",
    lifestyle: "",
    budget: "",
    gender: "",
  };
  return registerAccount(STUDENT_ACCOUNTS_KEY, formData, profile);
}

export async function authenticateStudent(identifier, password) {
  return authenticateAccount(STUDENT_ACCOUNTS_KEY, identifier, password);
}

export async function registerOwner(formData) {
  const identifier = normalizeIdentifier(formData.identifier);
  const profile = {
    name: formData.fullName.trim(),
    businessName: formData.businessName.trim(),
    email: formData.identifier.includes("@") ? formData.identifier.trim().toLowerCase() : "",
    phone: formData.identifier.includes("@") ? "" : formData.identifier.trim(),
    ownerId: identifier,
  };
  return registerAccount(OWNER_ACCOUNTS_KEY, formData, profile);
}

export async function authenticateOwner(identifier, password) {
  return authenticateAccount(OWNER_ACCOUNTS_KEY, identifier, password);
}

export async function updateStudentAccountProfile(identifier, profile) {
  if (!identifier) throw new Error("Could not identify the student account to update.");
  const normalizedIdentifier = normalizeIdentifier(identifier);
  let accounts = [];
  try {
    accounts = readAccounts(STUDENT_ACCOUNTS_KEY);
  } catch (error) {
    console.error("Could not read the browser account cache while updating profile data.", error);
  }
  const accountIndex = accounts.findIndex((account) => account.normalizedIdentifier === normalizedIdentifier);
  try {
    const savedProfile = await requestAccountApi("profile", "PATCH", {
      role: "student",
      identifier,
      profile,
    });
    if (accountIndex !== -1) {
      accounts[accountIndex] = { ...accounts[accountIndex], profile: savedProfile.profile };
      saveAccounts(STUDENT_ACCOUNTS_KEY, accounts);
    }
    return savedProfile.profile;
  } catch (apiError) {
    if (apiError.status !== 404 || accountIndex === -1) throw apiError;
    const account = accounts[accountIndex];
    await requestAccountApi("migrate", "POST", {
      role: "student",
      identifier,
      normalizedIdentifier,
      salt: account.salt,
      passwordHash: account.passwordHash,
      profile: account.profile,
    });
    const savedProfile = await requestAccountApi("profile", "PATCH", {
      role: "student",
      identifier,
      profile,
    });
    accounts[accountIndex] = { ...account, profile: savedProfile.profile };
    saveAccounts(STUDENT_ACCOUNTS_KEY, accounts);
    return savedProfile.profile;
  }
}
