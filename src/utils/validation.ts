import { StrKey } from "@stellar/stellar-sdk";

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

/**
 * Validates a Stellar public key using the SDK's own StrKey checker —
 * this verifies the checksum encoded into the address, not just its
 * length/prefix, so genuinely malformed addresses are caught immediately
 * (before we ever hit the network).
 */
export function validateRecipient(
  recipient: string,
  senderAddress: string | null
): ValidationResult {
  const trimmed = recipient.trim();

  if (!trimmed) {
    return { valid: false, error: "Recipient address is required." };
  }
  if (!StrKey.isValidEd25519PublicKey(trimmed)) {
    return { valid: false, error: "This doesn't look like a valid Stellar address." };
  }
  if (senderAddress && trimmed === senderAddress) {
    return { valid: false, error: "You can't send a payment to yourself." };
  }
  return { valid: true, error: null };
}

export function validateAmount(amount: string, availableBalance: string | null): ValidationResult {
  const trimmed = amount.trim();

  if (!trimmed) {
    return { valid: false, error: "Amount is required." };
  }
  const numeric = Number(trimmed);
  if (Number.isNaN(numeric) || numeric <= 0) {
    return { valid: false, error: "Amount must be greater than 0." };
  }
  if (availableBalance !== null && numeric >= Number(availableBalance)) {
    // Note: >= not > — a small XLM reserve + fee must remain in the
    // account, so spending the exact full balance would also fail.
    return { valid: false, error: "Amount exceeds your available balance." };
  }
  return { valid: true, error: null };
}
