# React + Vite

## Local account persistence

Run `npm run dev` to start the StayMate property API, local account API, and Vite app together. If an API port is already occupied, the other services continue running so account persistence does not disappear when Vite or the property API reports the conflict. Student and owner accounts are stored in `data/accounts.json`, which is created on startup and updated when an account is registered or a student profile is saved. Older accounts saved in browser storage are copied to the account file when their owner next signs in. The account file is ignored by Git so personal account data is not committed with the source code.

Passwords are stored as salted PBKDF2 hashes, not as plain text. The account API binds to the local computer and is intended only for this local prototype; do not expose it to the public internet or treat it as production authentication. Back up `data/accounts.json` somewhere private if you need to preserve accounts across computer reinstalls.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
