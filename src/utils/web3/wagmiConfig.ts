import { http, createConfig } from 'wagmi';
import { metaMask, walletConnect } from 'wagmi/connectors';
import { CHAINS } from '../../constants/chains';

// const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;

export const config = createConfig({
  chains: CHAINS,
  ssr: true,
  connectors: [
    // walletConnect({ projectId }),
    metaMask(),
  ],
  transports: CHAINS.reduce((acc, chain) => {
    acc[chain.id] = http();
    return acc;
  }, {} as Record<number, ReturnType<typeof http>>),
});
