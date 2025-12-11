import { Connector } from 'wagmi';
import MetaMaskIcon from '@/assets/metamask.svg';
import SaveWalletIcon from '@/assets/safeWallet.svg';
import WalletConnectIcon from '@/assets/walletConnect.svg';

export interface ConnectorMeta {
  id: string
  name: string
  shortName: string
  icon?: string
  deepLink?: string
}

export const ALL_CONNECTOR_META: ConnectorMeta[] = [
  {
    id: 'metaMaskSDK',
    name: 'MetaMask',
    shortName: 'MetaMask',
    icon: MetaMaskIcon,
  },
  {
    id: 'walletConnect',
    name: 'WalletConnect',
    shortName: 'WC',
    icon: WalletConnectIcon,
  },
  {
    id: 'coinbaseWallet',
    name: 'Coinbase Wallet',
    shortName: 'Coinbase',
  },
  {
    id: 'safe',
    name: 'Safe{Wallet}',
    shortName: 'Safe',
    icon: SaveWalletIcon,
    deepLink: 'safe://',
  },
  {
    id: 'ledger',
    name: 'Ledger',
    shortName: 'Ledger',
  },
  {
    id: 'com.trustwallet.app',
    name: 'Trust Wallet',
    shortName: 'Trust',
  },
  {
    id: 'injected-brave',
    name: 'Brave Wallet',
    shortName: 'Brave',
  },
  {
    id: 'injected-phantom',
    name: 'Phantom',
    shortName: 'Phantom',
  },
  {
    id: 'injected-rabby',
    name: 'Rabby Wallet',
    shortName: 'Rabby',
  },
  {
    id: 'injected-rainbow',
    name: 'Rainbow',
    shortName: 'Rainbow',
  },
  {
    id: 'injected-zerion',
    name: 'Zerion',
    shortName: 'Zerion',
  },
];

export const getConnectorMeta = (connector: Connector): ConnectorMeta | undefined => {
  return ALL_CONNECTOR_META.find(m => m.id === connector.id);
};
