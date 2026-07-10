// This file wraps all direct calls to the Stellar SDK / Horizon server.
// Like wallet.ts, keeping this isolated means components never talk to
// the SDK directly — if we ever swap Horizon for Soroban RPC or a
// different data source, only this file changes.

import { Horizon, TransactionBuilder, Operation, Asset, Memo } from "@stellar/stellar-sdk";
import { HORIZON_URL, FRIENDBOT_URL, NETWORK_PASSPHRASE, BASE_FEE } from "../utils/constants";

const server = new Horizon.Server(HORIZON_URL);

export class AccountNotFoundError extends Error {
  constructor(address: string) {
    super(
      `This account doesn't exist on the Testnet yet. New Stellar accounts need to be "funded" with a minimum XLM balance before they're active.`
    );
    this.name = "AccountNotFoundError";
    this.address = address;
  }
  address: string;
}

/**
 * Fetches the native XLM balance for a given Stellar public key.
 * Throws AccountNotFoundError for unfunded/invalid accounts (Horizon
 * returns HTTP 404 for these), or a generic Error for network failures.
 */
export async function getXlmBalance(address: string): Promise<string> {
  try {
    const account = await server.loadAccount(address);

    // An account can hold multiple assets (native XLM + custom tokens).
    // We specifically look for the "native" one, which represents XLM.
    const nativeBalance = account.balances.find(
      (b) => b.asset_type === "native"
    );

    return nativeBalance?.balance ?? "0";
  } catch (err: unknown) {
    // Horizon returns a 404 response for accounts that don't exist yet
    // (i.e. have never received any XLM / been funded).
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      throw new AccountNotFoundError(address);
    }
    throw new Error(
      "Couldn't reach the Stellar Testnet network. Check your connection and try again."
    );
  }
}

/** Funds a Testnet account via Friendbot — used for the "empty account" recovery flow. */
export async function fundWithFriendbot(address: string): Promise<void> {
  const response = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(address)}`);
  if (!response.ok) {
    throw new Error("Friendbot funding failed. Please try again in a moment.");
  }
}

/**
 * Builds an unsigned XLM payment transaction, ready to hand to Freighter
 * for signing. We build it as XDR (Stellar's binary-to-text transaction
 * format) because that's the format every wallet extension expects.
 */
export async function buildPaymentTransaction(
  sourceAddress: string,
  destinationAddress: string,
  amount: string,
  memo: string
): Promise<string> {
  // We must load the source account fresh right before building, because
  // Stellar transactions require the account's current sequence number —
  // an anti-replay counter that increments with every transaction. Using
  // a stale sequence number would cause the transaction to fail.
  const sourceAccount = await server.loadAccount(sourceAddress);

  const builder = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination: destinationAddress,
        asset: Asset.native(), // native = XLM, as opposed to a custom issued asset
        amount,
      })
    )
    .setTimeout(180); // transaction must be confirmed within 180 seconds or it expires

  if (memo.trim()) {
    builder.addMemo(Memo.text(memo.trim()));
  }

  const transaction = builder.build();
  return transaction.toXDR();
}

export interface SubmitResult {
  hash: string;
  ledger: number;
}

/**
 * Submits an already-signed transaction (as XDR) to the Testnet network.
 * Horizon returns the transaction hash and the ledger it was included in
 * once consensus confirms it.
 */
export async function submitSignedTransaction(signedXdr: string): Promise<SubmitResult> {
  const transaction = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);

  try {
    const response = await server.submitTransaction(transaction);
    return { hash: response.hash, ledger: response.ledger };
  } catch (err: unknown) {
    // Horizon's error responses include a "result_codes" object describing
    // exactly what went wrong (e.g. insufficient balance, bad destination).
    // We translate the most common ones into readable messages.
    const extras = (err as { response?: { data?: { extras?: { result_codes?: { transaction?: string; operations?: string[] } } } } })
      ?.response?.data?.extras?.result_codes;

    const opCode = extras?.operations?.[0];
    const txCode = extras?.transaction;

    if (opCode === "op_underfunded") {
      throw new Error("Insufficient balance to complete this payment (remember to leave enough XLM for network fees).");
    }
    if (opCode === "op_no_destination") {
      throw new Error("The recipient account doesn't exist on the Testnet yet.");
    }
    if (txCode === "tx_bad_seq") {
      throw new Error("Transaction sequence mismatch. Please try again.");
    }

    throw new Error("Transaction failed to submit. Please try again.");
  }
}
