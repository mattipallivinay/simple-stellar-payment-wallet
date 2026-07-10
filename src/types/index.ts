// The wallet's connection state. Modeling this as a union of "status"
// values (rather than a bunch of loose booleans) prevents impossible
// states like "connected: false" but "address: '0x123'" existing at once.
export type WalletStatus = "disconnected" | "connecting" | "connected" | "error";

export interface WalletState {
  status: WalletStatus;
  address: string | null;
  network: string | null;
  error: string | null;
}

export interface BalanceState {
  amount: string | null; // kept as string — XLM balances are decimal, avoid float rounding bugs
  loading: boolean;
  error: string | null;
}

export type TransactionStatus = "idle" | "building" | "signing" | "submitting" | "success" | "error";

export interface TransactionResult {
  status: TransactionStatus;
  hash: string | null;
  ledger: number | null;
  errorMessage: string | null;
}

export interface PaymentFormValues {
  recipient: string;
  amount: string;
  memo: string;
}
