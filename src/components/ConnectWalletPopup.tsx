'use client';
import { useConnect, useConnection, Connector, Config, useConnectors } from 'wagmi';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  CloseButton,
  useClose,
} from '@headlessui/react';
import Image from 'next/image';
import { getConnectorMeta } from '@/utils/web3/connectorsMeta';
import { useState } from 'react';
import { ConnectMutate } from 'wagmi/query';

const ConnectButton = ({ connector, connect, isPending }: { connector: Connector, connect: ConnectMutate<Config, unknown>, isPending: boolean }) => {
  const close = useClose();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const meta = getConnectorMeta(connector);
  const icon = meta?.icon || connector.icon;
  return (
    <button
      key={connector.id}
      onClick={() => {
        setIsConnecting(true);
        connect({ connector }, { onSuccess: close, onSettled: () => setIsConnecting(false) });
      }}
      disabled={isPending}
      className="w-full flex items-center gap-3 p-4 rounded-lg ring-standard button-hover"
    >
      {icon && <Image width={32} height={32} className="text-2xl" src={icon} alt="wallet_icon" />}
      <span className="font-medium text-standard">
        {meta?.name || connector.name}
      </span>
      {isConnecting && <span className="iconify line-md--loading-twotone-loop" />}
    </button>
  );
};

const ConnectWalletPopup = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  const { error, connect, isPending } = useConnect();
  const connectors = useConnectors();
  const { isConnected } = useConnection();
  const handleClose = () => {
    if (isConnected) {
      onClose();
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} className="fixed top-0 min-h-full z-50 w-screen flex-center">
      <DialogBackdrop
        transition
        className="absolute inset-0 bg-black/30 duration-300 ease-out data-closed:opacity-0"
      />
      <DialogPanel
        transition
        className="relative z-60 background-standard inset-2 flex-center flex-col rounded-lg w-xs h-min p-6 duration-300 ease-out data-closed:scale-95 data-closed:opacity-0 ring-standard"
      >
        {isConnected && (
          <CloseButton className="group absolute right-2 top-2 cursor-pointer">
            <span className="iconify material-symbols-light--close-small-rounded h-8 w-8 text-interactive-group" />
          </CloseButton>
        ) }
        <DialogTitle className="text-lg font-bold mb-6 text-center text-standard">
          Connect a Wallet
        </DialogTitle>
        <div className="space-y-3 w-full">
          {connectors.map(connector => (
            <ConnectButton
              key={connector.id}
              connector={connector}
              connect={connect}
              isPending={isPending}
            />
          ))}
          {error && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">
              {error.message || 'Failed to connect wallet'}
            </p>
          )}
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default ConnectWalletPopup;
