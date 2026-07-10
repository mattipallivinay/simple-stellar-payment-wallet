import { Moon, Sun, Wallet } from "lucide-react";

interface NavbarProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export default function Navbar({ isDark, onToggleDark }: NavbarProps) {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-stellar-600 flex items-center justify-center">
            <Wallet size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
              Stellar Payment Wallet
            </p>
            <span className="inline-block mt-1 text-[10px] font-medium uppercase tracking-wide text-stellar-700 bg-stellar-100 dark:bg-stellar-900/40 dark:text-stellar-300 rounded-full px-1.5 py-0.5">
              Testnet
            </span>
          </div>
        </div>

        <button
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}
