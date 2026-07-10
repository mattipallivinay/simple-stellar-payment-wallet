import { useCallback, useState } from "react";
import { buildPaymentTransaction, submitSignedTransaction } from "../services/stellar";
import { signTransaction } from "../services/wallet";
import type { TransactionResult } from "../types";

const INITIAL_STATE: TransactionResult = {
  status: "idle",
  hash: null,
  ledger: null,
  errorMessage: null,
};

export function useSendPayment(senderAddress: string | null) {
  const [result, setResult] = useState<TransactionResult>(INITIAL_STATE);

  const sendPayment = useCallback(
    async (destination: string, amount: string, memo: string) => {
      if (!senderAddress) {
        setResult({ ...INITIAL_STATE, status: "error", errorMessage: "Wallet is not connected." });
        return;
      }

      try {
        // Each stage updates status separately so the UI can show a
        // precise message ("Building transaction…" vs "Waiting for
        // approval in Freighter…" vs "Submitting…") instead of one
        // generic spinner.
        setResult({ status: "building", hash: null, ledger: null, errorMessage: null });
        const unsignedXdr = await buildPaymentTransaction(senderAddress, destination, amount, memo);

        setResult((prev) => ({ ...prev, status: "signing" }));
        const signedXdr = await signTransaction(unsignedXdr, senderAddress);

        setResult((prev) => ({ ...prev, status: "submitting" }));
        const { hash, ledger } = await submitSignedTransaction(signedXdr);

        setResult({ status: "success", hash, ledger, errorMessage: null });
      } catch (err) {
        setResult({
          status: "error",
          hash: null,
          ledger: null,
          errorMessage: err instanceof Error ? err.message : "An unknown error occurred.",
        });
      }
    },
    [senderAddress]
  );

  const reset = useCallback(() => setResult(INITIAL_STATE), []);

  return { result, sendPayment, reset };
}
