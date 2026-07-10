// Vite only exposes env vars prefixed with VITE_ to client-side code.
// Falling back to hardcoded Testnet values means the app still works
// even if someone forgets to create a .env file — and it can NEVER
// accidentally point at Mainnet by omission.

export const HORIZON_URL: string =
  import.meta.env.VITE_STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org";

export const NETWORK_PASSPHRASE: string =
  import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE ?? "Test SDF Network ; September 2015";

export const NETWORK_NAME = "TESTNET" as const;

// Stellar Testnet friendbot — used to fund new test accounts.
// We surface this in error messages when a wallet has 0 balance / doesn't exist yet.
export const FRIENDBOT_URL = "https://friendbot.stellar.org";

// Stellar Expert is a block explorer — used for the "View on Explorer" button.
export const EXPLORER_TX_URL = (hash: string) =>
  `https://stellar.expert/explorer/testnet/tx/${hash}`;

export const EXPLORER_ACCOUNT_URL = (address: string) =>
  `https://stellar.expert/explorer/testnet/account/${address}`;

// Base transaction fee in stroops (1 XLM = 10,000,000 stroops).
// 100 stroops is the current network minimum.
export const BASE_FEE = "100";
