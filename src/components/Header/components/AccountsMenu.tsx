import { shortenAddress } from '@/utils/format';
import WalletAvatar from '@/components/ui/WalletAvatar';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useConnection, useConnections, useSwitchConnection } from 'wagmi';
import { useWalletPopup } from '@/contexts/PopupContext';

const AddressShort = ({ address }: { address: string }) => {
  return (
    <span className="inline align-middle text-xs px-2 py-1 rounded-full text-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 ring-standard">
      {shortenAddress(address as string)}
    </span>
  );
};

const AccountsMenu = () => {
  const { address: currentAddress, isConnected } = useConnection();
  const { addWallet } = useWalletPopup();
  const { switchConnection } = useSwitchConnection();
  const connections = useConnections();
  const handleWalletClick = () => {
    addWallet();
  };

  return (
    <>
      {isConnected
        ? (
            <Menu>
              <MenuButton className="flex-center rounded-lg ring-standard bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-800/20  gap-2 p-2">
                <span className="iconify line-md--chevron-down text-standard"></span>
                <WalletAvatar address={currentAddress as string} />
                <AddressShort address={currentAddress as string} />
              </MenuButton>
              <MenuItems anchor="bottom" className="z-41 mt-2 w-40 origin-top-right rounded-md background-standard shadow-lg ring-standard focus:outline-none">
                {connections
                  .filter(conn => conn.accounts[0] !== currentAddress)
                  .map((connection) => {
                    return (
                      <MenuItem key={connection.connector.id}>
                        <div className="flex-center gap-2 p-2 cursor-pointer button-hover rounded-md" onClick={() => switchConnection({ connector: connection.connector })}>
                          <WalletAvatar address={connection.accounts[0]} />
                          <AddressShort address={connection.accounts[0] as string} />
                        </div>
                      </MenuItem>
                    );
                  })}
                <MenuItem>
                  <button
                    type="button"
                    className="w-full flex-center px-3 py-2 rounded-md text-standard button-hover"
                    onClick={handleWalletClick}
                  >
                    Add Wallet
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          )
        : (
            <button
              type="button"
              onClick={handleWalletClick}
              className="flex-center rounded-md button-hover text-standard px-3 py-2"
            >
              Connect Wallet
            </button>
          )}

    </>
  );
};

export default AccountsMenu;
