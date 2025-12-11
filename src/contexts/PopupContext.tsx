'use client';
import { createContext, useCallback, useMemo, useState, useContext, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useConnection } from 'wagmi';
const ConnectWalletPopup = dynamic(() => import('../components/ConnectWalletPopup'), { ssr: false });

type PopupContextValue = {
  addWallet: () => void
};

export const PopupContext = createContext<PopupContextValue | undefined>(undefined);

const PopupProvider = ({ children }: Readonly<{
  children: React.ReactNode
}>) => {
  const { isConnected, isConnecting } = useConnection();
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState<boolean>(false);
  const hasAttemptedConnect = useRef(false);

  useEffect(() => {
    if (hasAttemptedConnect.current && !isConnecting && !isConnected) {
      requestAnimationFrame(() => setIsWalletPopupOpen(true));
    }

    if (isConnecting) {
      hasAttemptedConnect.current = true;
    }
  }, [isConnected, isConnecting]);

  const addWallet = useCallback(() => {
    setIsWalletPopupOpen(true);
  }, []);

  const value = useMemo<PopupContextValue>(() => ({ addWallet }), [addWallet]);

  return (
    <PopupContext.Provider value={value}>
      <ConnectWalletPopup open={isWalletPopupOpen} onClose={() => setIsWalletPopupOpen(false)} />
      {children}
    </PopupContext.Provider>
  );
};

export function useWalletPopup(): PopupContextValue {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error('useWalletPopup must be used within PopupContext');
  return ctx;
}

export default PopupProvider;
