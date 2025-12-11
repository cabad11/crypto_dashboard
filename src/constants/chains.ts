import { mainnet, polygon, arbitrum, base, optimism, bsc, avalanche, gnosis, fantom, zksync, bscTestnet, sepolia } from 'wagmi/chains';

export const CHAINS = [
  mainnet,
  polygon,
  arbitrum,
  base,
  optimism,
  bsc,
  avalanche,
  gnosis,
  fantom,
  zksync,
  // todo remove
  sepolia,
] as const;
