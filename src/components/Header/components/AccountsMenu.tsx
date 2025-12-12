import { shortenAddress } from '@/utils/format';
import WalletAvatar from '@/components/ui/WalletAvatar';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useConnection, useConnections, useSwitchConnection } from 'wagmi';
import { useWalletPopup } from '@/contexts/PopupContext';

const AddressShort = ({ address }: { address: string }) => {
  return (
    <span className={`
      inline rounded-full bg-gray-100 px-2 py-1 text-center align-middle text-xs
      text-gray-800 ring-standard
      dark:bg-gray-800 dark:text-gray-200
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
              <MenuButton className={`
                flex-center gap-2 rounded-lg bg-white p-2 ring-standard
                hover:bg-gray-100
                dark:bg-black dark:hover:bg-gray-800/20
              `}
              >
                <span className="iconify text-standard line-md--chevron-down"></span>
                <WalletAvatar address={currentAddress as string} />
                <AddressShort address={currentAddress as string} />
              </MenuButton>
              <MenuItems
                anchor="bottom"
                className={`
                  z-41 mt-2 w-40 origin-top-right rounded-md background-standard
                  shadow-lg ring-standard
                  focus:outline-none
                `}
              >
                {connections
                  .filter(conn => conn.accounts[0] !== currentAddress)
                  .map((connection) => {
                    return (
                      <MenuItem key={connection.connector.id}>
                        <div
                          className={`
                            flex-center cursor-pointer gap-2 rounded-md
                            button-hover p-2
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
                      flex-center w-full rounded-md button-hover px-3 py-2
                      text-standard
                    `}
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
              className={`
                flex-center rounded-md button-hover px-3 py-2 text-standard
              `}
            >
              Connect Wallet
            </button>
          )}

    </>
  );
};

export default AccountsMenu;
