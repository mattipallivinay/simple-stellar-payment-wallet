import { shortenAddress } from "../utils/format";
import type { WalletState } from "../types";

type FreighterAvailability = "checking" | "installed" | "not-installed";

interface WalletCardProps {
  freighterAvailability: FreighterAvailability;
  wallet: WalletState;
  connect: () => void;
  disconnect: () => void;
}

// WalletCard is now a "presentational" component — it receives wallet
// state and actions as props rather than calling useWallet() itself.
// This means there's exactly ONE source of truth for wallet state (in
// App), and any other component (BalanceCard, PaymentForm, etc.) can
// share that same state without triggering duplicate Freighter calls.
export default function WalletCard({
  freighterAvailability,
  wallet,
  connect,
  disconnect,
}: WalletCardProps) {
  return (
    <div className="max-w-md mx-auto mt-16 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Wallet
      </h2>

      {freighterAvailability === "checking" && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Checking for Freighter Wallet…
        </p>
      )}

      {freighterAvailability === "not-installed" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Freighter Wallet not found
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You'll need the Freighter browser extension to use this app.
          </p>
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-stellar-600 hover:bg-stellar-700 text-white text-sm font-medium px-4 py-2 transition-colors"
          >
            Install Freighter
          </a>
        </div>
      )}

      {freighterAvailability === "installed" && wallet.status !== "connected" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Freighter detected
          </div>

          <button
            onClick={connect}
            disabled={wallet.status === "connecting"}
            className="w-full rounded-lg bg-stellar-600 hover:bg-stellar-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 transition-colors"
          >
            {wallet.status === "connecting" ? "Connecting…" : "Connect Wallet"}
          </button>

          {wallet.status === "error" && wallet.error && (
            <p className="text-sm text-red-600 dark:text-red-400">{wallet.error}</p>
          )}
        </div>
      )}

      {wallet.status === "connected" && wallet.address && (
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Address</p>
            <p className="font-mono text-sm text-gray-900 dark:text-white">
              {shortenAddress(wallet.address)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Network</p>
            <span className="inline-block text-xs font-medium bg-stellar-100 text-stellar-700 rounded-full px-2.5 py-1">
              {wallet.network}
            </span>
          </div>

          <button
            onClick={disconnect}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium px-4 py-2.5 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
