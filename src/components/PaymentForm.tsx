import { useEffect, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { validateRecipient, validateAmount } from "../utils/validation";
import { useSendPayment } from "../hooks/useSendPayment";
import type { TransactionResult } from "../types";

interface PaymentFormProps {
  senderAddress: string;
  senderBalance: string | null;
  onResult: (result: TransactionResult) => void;
}

const STATUS_LABELS: Record<string, string> = {
  building: "Building transaction…",
  signing: "Waiting for approval in Freighter…",
  submitting: "Submitting to the network…",
};

export default function PaymentForm({ senderAddress, senderBalance, onResult }: PaymentFormProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ recipient?: string; amount?: string }>({});

  const { result, sendPayment } = useSendPayment(senderAddress);
  const isBusy = result.status === "building" || result.status === "signing" || result.status === "submitting";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const recipientCheck = validateRecipient(recipient, senderAddress);
    const amountCheck = validateAmount(amount, senderBalance);

    if (!recipientCheck.valid || !amountCheck.valid) {
      setFieldErrors({
        recipient: recipientCheck.error ?? undefined,
        amount: amountCheck.error ?? undefined,
      });
      return;
    }

    setFieldErrors({});
    sendPayment(recipient.trim(), amount.trim(), memo);
  }

  // Propagate every status change up to the parent, which renders the
  // TransactionModal (success/failure card). This keeps PaymentForm
  // focused purely on input + validation, not result presentation.
  // Done in an effect (not during render) — updating a *different*
  // component's state while this one is rendering is a React anti-pattern
  // that can trigger warnings or extra re-renders.
  useEffect(() => {
    if (result.status !== "idle") {
      onResult(result);
    }
  }, [result, onResult]);

  return (
    <div className="max-w-md mx-auto mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="G..."
            disabled={isBusy}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-stellar-500 disabled:opacity-60"
          />
          {fieldErrors.recipient && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.recipient}</p>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
            Amount (XLM)
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            disabled={isBusy}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-stellar-500 disabled:opacity-60"
          />
          {fieldErrors.amount && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
            Memo <span className="normal-case text-gray-300">(optional)</span>
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Add a note…"
            maxLength={28}
            disabled={isBusy}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-stellar-500 disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-stellar-600 hover:bg-stellar-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 transition-colors"
        >
          {isBusy ? (
            <>
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              {STATUS_LABELS[result.status]}
            </>
          ) : (
            <>
              <Send size={15} />
              Send Payment
            </>
          )}
        </button>
      </form>
    </div>
  );
}
