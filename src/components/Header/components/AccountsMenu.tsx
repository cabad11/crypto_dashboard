'use client';

import { shortenAddress } from '@/utils/format';
import WalletAvatar from '@/components/ui/WalletAvatar';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useConnection, useConnections, useSwitchConnection } from 'wagmi';
import { useWalletPopup } from '@/contexts/PopupContext';

const AddressShort = ({ address }: { address: string }) => {
  return (
    <span
      className={`
        inline truncate rounded-full bg-gray-100 px-2.5 py-1 text-center
        align-middle text-xs font-medium text-gray-800 ring-1 ring-gray-200/60
        dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700/60
      `}
    >
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
              <MenuButton
                className={`
                  flex-center min-w-12 gap-2 rounded-lg bg-white px-3 py-2
                  shadow-sm ring-standard transition-all
                  hover:bg-gray-50 hover:shadow-md
                  dark:bg-gray-900 dark:hover:bg-gray-800
                `}
              >
                <WalletAvatar address={currentAddress as string} />
                <AddressShort address={currentAddress as string} />
                <span className={`
                  iconify text-gray-600 transition-transform
                  line-md--chevron-small-down
                  group-data-open:rotate-180
                  dark:text-gray-400
                `}
                >
                </span>
              </MenuButton>
              <MenuItems
                anchor="bottom end"
                transition
                className={`
                  z-41 mt-2 w-50 origin-top-right rounded-lg bg-white p-2
                  shadow-lg ring-standard transition duration-200 ease-out
                  focus:outline-none
                  data-closed:scale-95 data-closed:opacity-0
                  dark:bg-gray-900
                `}
              >
                {connections
                  .filter(conn => conn.accounts[0] !== currentAddress)
                  .map((connection) => {
                    return (
                      <MenuItem key={connection.connector.id}>
                        <div
                          className={`
                            flex-center cursor-pointer gap-2 rounded-md px-3
                            py-2 transition-colors
                            hover:bg-gray-100
                            dark:hover:bg-gray-800
                          `}
                          onClick={() => switchConnection({ connector: connection.connector })}
                        >
                          <WalletAvatar address={connection.accounts[0]} />
                          <AddressShort address={connection.accounts[0] as string} />
                        </div>
                      </MenuItem>
                    );
                  })}
                <MenuItem>
                  <button
                    type="button"
                    className={`
                      flex-center w-full rounded-md px-3 py-2 text-sm
                      font-medium text-gray-700 transition-colors
                      hover:bg-gray-100
                      dark:text-gray-300 dark:hover:bg-gray-800
                    `}
                    onClick={handleWalletClick}
                  >
                    <span className="mr-2 iconify material-symbols-light--add"></span>
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
              className={`
                flex-center rounded-lg bg-linear-to-r from-indigo-600
                to-purple-600 px-4 py-2 text-sm font-semibold text-white
                shadow-sm transition-all
                hover:from-indigo-700 hover:to-purple-700 hover:shadow-md
              `}
            >
              Connect Wallet
            </button>
          )}
    </>
  );
};

export default AccountsMenu;
