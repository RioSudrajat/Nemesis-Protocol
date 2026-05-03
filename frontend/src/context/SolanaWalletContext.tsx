"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useToast } from "@/components/ui/Toast";
import { useDepinStore } from "@/store/useDepinStore";

type SolanaPublicKeyLike = {
  toString: () => string;
};

type SolanaInjectedProvider = {
  isPhantom?: boolean;
  isBackpack?: boolean;
  publicKey?: SolanaPublicKeyLike | null;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: SolanaPublicKeyLike }>;
  disconnect: () => Promise<void>;
  on?: (event: "connect" | "disconnect" | "accountChanged", handler: (...args: unknown[]) => void) => void;
  off?: (event: "connect" | "disconnect" | "accountChanged", handler: (...args: unknown[]) => void) => void;
};

type SolanaWalletWindow = Window & {
  solana?: SolanaInjectedProvider;
  phantom?: {
    solana?: SolanaInjectedProvider;
  };
  backpack?: {
    solana?: SolanaInjectedProvider;
  };
};

type WalletStatus = "idle" | "connecting" | "connected" | "error";

type SolanaWalletContextValue = {
  address: string | null;
  providerName: string | null;
  status: WalletStatus;
  isConnected: boolean;
  isInstalled: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

const SolanaWalletContext = createContext<SolanaWalletContextValue | null>(null);

const WALLET_AUTOCONNECT_KEY = "nemesis-solana-wallet-autoconnect";

function getInjectedProvider(): { provider: SolanaInjectedProvider; name: string } | null {
  if (typeof window === "undefined") return null;

  const walletWindow = window as SolanaWalletWindow;
  const candidates = [
    { provider: walletWindow.phantom?.solana, name: "Phantom" },
    { provider: walletWindow.backpack?.solana, name: "Backpack" },
    { provider: walletWindow.solana, name: "Solana Wallet" },
  ];

  const found = candidates.find((candidate) => Boolean(candidate.provider));
  return found?.provider ? { provider: found.provider, name: found.name } : null;
}

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const setDepinWallet = useDepinStore((state) => state.setWallet);
  const [provider, setProvider] = useState<SolanaInjectedProvider | null>(null);
  const [providerName, setProviderName] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<WalletStatus>("idle");
  const [isInstalled, setIsInstalled] = useState(false);

  const syncAddress = useCallback(
    (nextAddress: string | null) => {
      setAddress(nextAddress);
      setDepinWallet(nextAddress);
    },
    [setDepinWallet],
  );

  const refreshProvider = useCallback(() => {
    const detected = getInjectedProvider();
    setProvider(detected?.provider ?? null);
    setProviderName(detected?.name ?? null);
    setIsInstalled(Boolean(detected?.provider));
    return detected;
  }, []);

  const connect = useCallback(async () => {
    const detected = provider ? { provider, name: providerName ?? "Solana Wallet" } : refreshProvider();

    if (!detected?.provider) {
      setStatus("error");
      showToast("error", "Wallet not found", "Install Phantom or Backpack, then refresh this page.");
      return;
    }

    try {
      setStatus("connecting");
      const response = await detected.provider.connect();
      const nextAddress = response.publicKey.toString();
      syncAddress(nextAddress);
      localStorage.setItem(WALLET_AUTOCONNECT_KEY, "true");
      setStatus("connected");
      showToast("success", "Wallet connected", `${detected.name}: ${nextAddress.slice(0, 4)}...${nextAddress.slice(-4)}`);
    } catch (error) {
      setStatus("error");
      showToast(
        "error",
        "Connection cancelled",
        error instanceof Error ? error.message : "The wallet did not approve the connection.",
      );
    }
  }, [provider, providerName, refreshProvider, showToast, syncAddress]);

  const disconnect = useCallback(async () => {
    const activeProvider = provider ?? refreshProvider()?.provider;

    try {
      await activeProvider?.disconnect();
    } finally {
      localStorage.removeItem(WALLET_AUTOCONNECT_KEY);
      syncAddress(null);
      setStatus("idle");
      showToast("info", "Wallet disconnected");
    }
  }, [provider, refreshProvider, showToast, syncAddress]);

  useEffect(() => {
    const detected = refreshProvider();
    if (!detected?.provider) return;

    const handleConnect = (...args: unknown[]) => {
      const maybePublicKey = args[0] as SolanaPublicKeyLike | undefined;
      const nextAddress = maybePublicKey?.toString?.() ?? detected.provider.publicKey?.toString?.() ?? null;
      if (nextAddress) {
        syncAddress(nextAddress);
        setStatus("connected");
      }
    };

    const handleDisconnect = () => {
      localStorage.removeItem(WALLET_AUTOCONNECT_KEY);
      syncAddress(null);
      setStatus("idle");
    };

    const handleAccountChanged = (...args: unknown[]) => {
      const maybePublicKey = args[0] as SolanaPublicKeyLike | null | undefined;
      const nextAddress = maybePublicKey?.toString?.() ?? null;
      syncAddress(nextAddress);
      setStatus(nextAddress ? "connected" : "idle");
    };

    detected.provider.on?.("connect", handleConnect);
    detected.provider.on?.("disconnect", handleDisconnect);
    detected.provider.on?.("accountChanged", handleAccountChanged);

    const shouldReconnect = localStorage.getItem(WALLET_AUTOCONNECT_KEY) === "true";
    if (shouldReconnect) {
      detected.provider
        .connect({ onlyIfTrusted: true })
        .then((response) => {
          syncAddress(response.publicKey.toString());
          setStatus("connected");
        })
        .catch(() => {
          localStorage.removeItem(WALLET_AUTOCONNECT_KEY);
        });
    }

    return () => {
      detected.provider.off?.("connect", handleConnect);
      detected.provider.off?.("disconnect", handleDisconnect);
      detected.provider.off?.("accountChanged", handleAccountChanged);
    };
  }, [refreshProvider, syncAddress]);

  const value = useMemo<SolanaWalletContextValue>(
    () => ({
      address,
      providerName,
      status,
      isConnected: Boolean(address),
      isInstalled,
      connect,
      disconnect,
    }),
    [address, connect, disconnect, isInstalled, providerName, status],
  );

  return <SolanaWalletContext.Provider value={value}>{children}</SolanaWalletContext.Provider>;
}

export function useSolanaWallet() {
  const context = useContext(SolanaWalletContext);
  if (!context) {
    throw new Error("useSolanaWallet must be used inside SolanaWalletProvider");
  }
  return context;
}
