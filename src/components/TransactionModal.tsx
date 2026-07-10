import { CheckCircle2, XCircle, Copy, ExternalLink, X } from "lucide-react";
import toast from "react-hot-toast";
import { EXPLORER_TX_URL } from "../utils/constants";
import type { TransactionResult } from "../types";

interface TransactionModalProps {
  result: TransactionResult;
  onClose: () => void;
}

// Only rendered by the parent when status is "success" or "error" —
// the in-progress states (building/signing/submitting) are handled
// inline inside PaymentForm's own button, not here.
export default function TransactionModal({ result, onClose }: TransactionModalProps) {
  const isSuccess = result.status === "success";

  function handleCopy() {
    if (!result.hash) return;
    navigator.clipboard.writeText(result.hash);
    toast.success("Transaction hash copied");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl relative"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center gap-3">
          {isSuccess ? (
            <CheckCircle2 className="text-green-500" size={48} />
          ) : (
            <XCircle className="text-red-500" size={48} />
          )}

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isSuccess ? "Transaction Successful" : "Transaction Failed"}
          </h3>

          {isSuccess ? (
            <div className="w-full space-y-3 mt-2">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3 text-left">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Transaction Hash
                </p>
                <p className="font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                  {result.hash}
                </p>
              </div>

              {result.ledger !== null && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Included in ledger #{result.ledger}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 px-3 py-2 transition-colors"
                >
                  <Copy size={14} />
                  Copy Hash
                </button>
                <a
                  href={EXPLORER_TX_URL(result.hash!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-stellar-600 hover:bg-stellar-700 text-white text-sm font-medium px-3 py-2 transition-colors"
                >
                  <ExternalLink size={14} />
                  Explorer
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300">{result.errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
