import { RefreshCw } from "lucide-react";
import { fundWithFriendbot } from "../services/stellar";
import { useState } from "react";
import type { BalanceState } from "../types";

interface BalanceCardProps {
  address: string;
  balance: BalanceState;
  isUnfunded: boolean;
  refresh: () => void;
}

// Presentational component, mirroring the WalletCard pattern — App owns
// the useBalance() hook as the single source of truth, since PaymentForm
// also needs the current balance (for the "amount exceeds balance"
// validation check).
export default function BalanceCard({ address, balance, isUnfunded, refresh }: BalanceCardProps) {
  const [funding, setFunding] = useState(false);

  async function handleFund() {
    setFunding(true);
    try {
      await fundWithFriendbot(address);
      refresh();
    } catch {
      // refresh() surfaces its own error state if funding didn't work
    } finally {
      setFunding(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Balance</h2>
        <button
          onClick={refresh}
          disabled={balance.loading}
          aria-label="Refresh balance"
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw
            size={16}
            className={`text-gray-500 dark:text-gray-300 ${balance.loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {balance.loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading balance…</p>
      )}

      {!balance.loading && balance.amount !== null && (
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {Number(balance.amount).toLocaleString(undefined, { maximumFractionDigits: 7 })}{" "}
          <span className="text-base font-medium text-gray-400">XLM</span>
        </p>
      )}

      {!balance.loading && balance.error && (
        <div className="space-y-3">
          <p className="text-sm text-red-600 dark:text-red-400">{balance.error}</p>
          {isUnfunded && (
            <button
              onClick={handleFund}
              disabled={funding}
              className="w-full rounded-lg bg-stellar-600 hover:bg-stellar-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 transition-colors"
            >
              {funding ? "Funding…" : "Fund with Friendbot (Testnet)"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
