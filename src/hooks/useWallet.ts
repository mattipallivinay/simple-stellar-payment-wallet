import { useCallback, useEffect, useState } from "react";
import { isFreighterInstalled, isSiteAllowed, connectWallet } from "../services/wallet";
import { NETWORK_NAME } from "../utils/constants";
import type { WalletState } from "../types";

type FreighterAvailability = "checking" | "installed" | "not-installed";

const INITIAL_STATE: WalletState = {
  status: "disconnected",
  address: null,
  network: null,
  error: null,
};

export function useWallet() {
  const [freighterAvailability, setFreighterAvailability] =
    useState<FreighterAvailability>("checking");
  const [wallet, setWallet] = useState<WalletState>(INITIAL_STATE);

  // On first load: check Freighter is installed, then (separately) check
  // whether THIS site was already granted access in a past session. If so,
  // we silently restore the connection — the user shouldn't have to click
  // "Connect" again every time they refresh the page.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const installed = await isFreighterInstalled();
      if (cancelled) return;
      setFreighterAvailability(installed ? "installed" : "not-installed");

      if (!installed) return;

      const alreadyAllowed = await isSiteAllowed();
      if (cancelled || !alreadyAllowed) return;

      try {
        const result = await connectWallet();
        if (!cancelled) {
          setWallet({ status: "connected", address: result.address, network: result.network, error: null });
        }
      } catch {
        // Silent restore failed — leave wallet disconnected, no need to
        // surface an error since the user never explicitly clicked Connect.
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = useCallback(async () => {
    setWallet((prev) => ({ ...prev, status: "connecting", error: null }));

    try {
      const result = await connectWallet();

      if (result.network !== NETWORK_NAME) {
        setWallet({
          status: "error",
          address: null,
          network: result.network,
          error: `Wrong network selected in Freighter. Please switch to ${NETWORK_NAME} and try again.`,
        });
        return;
      }

      setWallet({ status: "connected", address: result.address, network: result.network, error: null });
    } catch (err) {
      setWallet({
        status: "error",
        address: null,
        network: null,
        error: err instanceof Error ? err.message : "Failed to connect wallet.",
      });
    }
  }, []);

  // Freighter has no API to revoke a site's permission programmatically —
  // that's a deliberate security decision on their part (only the user can
  // revoke access, from inside the extension itself). So "Disconnect" here
  // means: clear OUR app's local state. Next page load, isSiteAllowed()
  // would still restore the connection unless the user also revokes access
  // in Freighter's settings — this matches how most Stellar dApps behave.
  const disconnect = useCallback(() => {
    setWallet(INITIAL_STATE);
  }, []);

  return { freighterAvailability, wallet, connect, disconnect };
}
