// This file wraps everything we need from the Freighter browser extension.
// Keeping it isolated (rather than calling @stellar/freighter-api directly
// inside components) means: if Freighter's API ever changes, or we want to
// support a second wallet later, we only edit this one file.

import {
  isConnected,
  isAllowed,
  setAllowed,
  getAddress,
  getNetwork,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";
import { NETWORK_PASSPHRASE } from "../utils/constants";

/**
 * Checks whether the Freighter browser extension is installed at all.
 * Freighter injects itself into the page, so `isConnected()` resolves
 * successfully (even if the user hasn't connected yet) only when the
 * extension exists. If it's not installed, the call itself fails/returns
 * isConnected: false with an error we can detect.
 */
export async function isFreighterInstalled(): Promise<boolean> {
  try {
    const result = await isConnected();
    // Freighter's API returns { isConnected: boolean, error?: string }
    // If there's no error, the extension responded — meaning it exists.
    return result.error === undefined;
  } catch {
    // Any thrown error means `window.freighterApi` never showed up.
    return false;
  }
}

/**
 * Checks whether THIS site has already been granted permission by the user
 * in a previous session, so we can auto-restore the connection on page load
 * without forcing them to click "Connect" again every time.
 */
export async function isSiteAllowed(): Promise<boolean> {
  try {
    const result = await isAllowed();
    return Boolean(result.isAllowed) && result.error === undefined;
  } catch {
    return false;
  }
}

export { setAllowed, getAddress, getNetwork };

export interface ConnectResult {
  address: string;
  network: string;
}

/**
 * Requests permission from the user (via the Freighter popup) and, once
 * granted, retrieves their public key + current network.
 *
 * Freighter's `setAllowed()` is what actually triggers the "Connect" popup
 * in the extension. If the user clicks "Reject" in that popup, Freighter
 * does NOT throw — it resolves with isAllowed: false, so we check for that
 * explicitly rather than relying on a try/catch alone.
 */
export async function connectWallet(): Promise<ConnectResult> {
  const allowedResult = await setAllowed();

  if (allowedResult.error || !allowedResult.isAllowed) {
    throw new Error("Connection request was rejected. Please approve the connection in Freighter.");
  }

  const addressResult = await getAddress();
  if (addressResult.error || !addressResult.address) {
    throw new Error("Could not retrieve your wallet address from Freighter.");
  }

  const networkResult = await getNetwork();
  if (networkResult.error) {
    throw new Error("Could not detect the selected network in Freighter.");
  }

  return {
    address: addressResult.address,
    network: networkResult.network ?? "UNKNOWN",
  };
}

/**
 * Sends an unsigned transaction (XDR) to Freighter for the user to review
 * and sign. This is what triggers the "Approve / Reject" popup showing the
 * transaction details. Freighter does NOT throw when the user clicks
 * "Reject" — it resolves with an error field, same pattern as connect.
 */
export async function signTransaction(unsignedXdr: string, signerAddress: string): Promise<string> {
  const result = await freighterSignTransaction(unsignedXdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: signerAddress,
  });

  if (result.error || !result.signedTxXdr) {
    throw new Error("Transaction was cancelled or rejected in Freighter.");
  }

  return result.signedTxXdr;
}
