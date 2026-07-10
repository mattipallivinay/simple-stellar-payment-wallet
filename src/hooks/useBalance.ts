import { useCallback, useEffect, useState } from "react";
import { getXlmBalance, AccountNotFoundError } from "../services/stellar";
import type { BalanceState } from "../types";

const INITIAL_STATE: BalanceState = {
  amount: null,
  loading: false,
  error: null,
};

export function useBalance(address: string | null) {
  const [balance, setBalance] = useState<BalanceState>(INITIAL_STATE);
  // Tracked separately from the generic error message so the UI can show
  // a "Fund with Friendbot" button only for this specific, recoverable case.
  const [isUnfunded, setIsUnfunded] = useState(false);

  const refresh = useCallback(async () => {
    if (!address) return;

    setBalance((prev) => ({ ...prev, loading: true, error: null }));
    setIsUnfunded(false);

    try {
      const amount = await getXlmBalance(address);
      setBalance({ amount, loading: false, error: null });
    } catch (err) {
      if (err instanceof AccountNotFoundError) {
        setIsUnfunded(true);
        setBalance({ amount: null, loading: false, error: err.message });
      } else {
        setBalance({
          amount: null,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to fetch balance.",
        });
      }
    }
  }, [address]);

  // Auto-fetch whenever the connected address changes (including on
  // initial connect, and reset back to empty when disconnected).
  useEffect(() => {
    if (address) {
      refresh();
    } else {
      setBalance(INITIAL_STATE);
      setIsUnfunded(false);
    }
  }, [address, refresh]);

  return { balance, isUnfunded, refresh };
}
