'use client';
import { useConnect, useConnection, type Connector, type Config, useConnectors } from 'wagmi';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, CloseButton, useClose } from '@headlessui/react';
import Image from 'next/image';
import { getConnectorMeta } from '@/utils/web3/connectorsMeta';
import { useState } from 'react';
import type { ConnectMutate } from 'wagmi/query';

const ConnectButton = ({
  connector,
  connect,
  isPending,
}: { connector: Connector, connect: ConnectMutate<Config, unknown>, isPending: boolean }) => {
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
      className={`
        flex w-full cursor-pointer items-center gap-4 rounded-lg bg-white p-4
        shadow-sm ring-1 ring-gray-200/60 transition-all
        hover:bg-gray-50 hover:shadow-md
        disabled:cursor-not-allowed disabled:opacity-50
        dark:bg-gray-900 dark:ring-gray-800/60 dark:hover:bg-gray-800
      `}
    >
      {icon && (
        <Image width={40} height={40} className="rounded-lg" src={icon} alt="wallet_icon" />
      )}
      <span className="text-base font-semibold text-standard">
        {meta?.name || connector.name}
      </span>
      {isConnecting && (
        <span className={`
          iconify text-indigo-600 line-md--loading-twotone-loop
          dark:text-indigo-400
        `}
        />
      )}
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
    <Dialog
      open={open}
      onClose={handleClose}
      className="fixed top-0 z-50 flex-center min-h-full w-screen"
    >
      <DialogBackdrop
        transition
        className={`
          absolute inset-0 bg-black/40 backdrop-blur-sm duration-300 ease-out
          data-closed:opacity-0
        `}
      />
      <DialogPanel
        transition
        className={`
          card-standard relative inset-2 z-60 flex-center h-min w-full max-w-md
          flex-col duration-300 ease-out
          data-closed:scale-95 data-closed:opacity-0
        `}
      >
        {isConnected && (
          <CloseButton
            className={`
              group absolute top-4 right-4 flex-center h-8 w-8 cursor-pointer
              rounded-lg transition-colors
              hover:bg-gray-100
              dark:hover:bg-gray-800
            `}
          >
            <span
              className={`
                iconify h-6 w-6 text-gray-600 transition-colors
                material-symbols-light--close-small-rounded
                group-hover:text-gray-900
                dark:text-gray-400 dark:group-hover:text-gray-100
              `}
            />
          </CloseButton>
        )}
        <div className="mb-6 flex-center flex-col gap-3">
          <div
            className={`
              flex-center h-12 w-12 rounded-xl bg-linear-to-br from-indigo-500
              via-purple-500 to-pink-500
            `}
          >
            <span className={`
              iconify h-7 w-7 text-white material-symbols-light--wallet
            `}
            />
          </div>
          <DialogTitle
            className="text-center text-xl font-bold text-standard"
          >
            Connect a Wallet
          </DialogTitle>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Choose your preferred wallet to continue
          </p>
        </div>
        <div className="w-full space-y-3">
          {connectors.map(connector => (
            <ConnectButton key={connector.id} connector={connector} connect={connect} isPending={isPending} />
          ))}
          {error && (
            <div
              className={`
                mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 ring-1
                ring-red-200/60
                dark:bg-red-950/20 dark:ring-red-900/60
              `}
            >
              <span className={`
                mt-0.5 iconify h-5 w-5 shrink-0 text-red-600
                material-symbols-light--error
                dark:text-red-400
              `}
              />
              <p className="text-sm text-red-700 dark:text-red-300">{error.message || 'Failed to connect wallet'}</p>
            </div>
          )}
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default ConnectWalletPopup;
