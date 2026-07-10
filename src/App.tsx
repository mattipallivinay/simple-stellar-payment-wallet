import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WalletCard from "./components/WalletCard";
import BalanceCard from "./components/BalanceCard";
import PaymentForm from "./components/PaymentForm";
import TransactionModal from "./components/TransactionModal";
import { useWallet } from "./hooks/useWallet";
import { useBalance } from "./hooks/useBalance";
import { useDarkMode } from "./hooks/useDarkMode";
import type { TransactionResult } from "./types";

function App() {
  const { freighterAvailability, wallet, connect, disconnect } = useWallet();
  const { balance, isUnfunded, refresh: refreshBalance } = useBalance(wallet.address);
  const { isDark, toggle: toggleDark } = useDarkMode();

  const [modalResult, setModalResult] = useState<TransactionResult | null>(null);
  const [formKey, setFormKey] = useState(0);

  const handleResult = useCallback(
    (result: TransactionResult) => {
      if (result.status === "success") {
        toast.success("Payment sent successfully");
        setModalResult(result);
        refreshBalance();
      } else if (result.status === "error") {
        toast.error(result.errorMessage ?? "Transaction failed");
        setModalResult(result);
      }
    },
    [refreshBalance]
  );

  return (
    // flex-col + min-h-screen on the wrapper, mt-auto on Footer: this is
    // what pins the footer to the bottom even on short pages (e.g. before
    // a wallet is connected) instead of it floating mid-page.
    <div className="min-h-screen flex flex-col">
      <Navbar isDark={isDark} onToggleDark={toggleDark} />

      <main className="flex-1 px-4 pb-16 pt-8">
        <WalletCard
          freighterAvailability={freighterAvailability}
          wallet={wallet}
          connect={connect}
          disconnect={disconnect}
        />

        {wallet.status === "connected" && wallet.address && (
          <>
            <BalanceCard
              address={wallet.address}
              balance={balance}
              isUnfunded={isUnfunded}
              refresh={refreshBalance}
            />
            <PaymentForm
              key={formKey}
              senderAddress={wallet.address}
              senderBalance={balance.amount}
              onResult={handleResult}
            />
          </>
        )}
      </main>

      <Footer />

      {modalResult && (
        <TransactionModal
          result={modalResult}
          onClose={() => {
            setModalResult(null);
            if (modalResult.status === "success") {
              setFormKey((k) => k + 1);
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
