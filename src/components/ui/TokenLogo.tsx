'use client';

import Image from 'next/image';
import { mainnet, polygon, arbitrum, base, optimism, bsc, avalanche, gnosis, fantom, zksync, bscTestnet, sepolia } from 'wagmi/chains';

enum SourceType {
  ICONIFY,
  IMAGE_URL,
}
type LogoSource = { path: string, type: SourceType };
const TOKEN_LOGO_MAP: Record<string, LogoSource> = {
  WETH: { path: 'token-branded--eth', type: SourceType.ICONIFY },
  ETH: { path: 'token-branded--eth', type: SourceType.ICONIFY },
  BNB: { path: 'token-branded--bnb', type: SourceType.ICONIFY },
  WBTC: { path: 'token-branded--bitcoin', type: SourceType.ICONIFY },
  ARB: { path: 'token-branded--arbitrum-one', type: SourceType.ICONIFY },
  POL: { path: 'token-branded--polygon', type: SourceType.ICONIFY },
  OP: { path: 'token-branded--optimism', type: SourceType.ICONIFY },
  FTM: { path: 'token-branded--fantom', type: SourceType.ICONIFY },
  LINK: { path: 'token-branded--link', type: SourceType.ICONIFY },
  AAVE: { path: 'token-branded--aave', type: SourceType.ICONIFY },
  UNI: { path: 'token-branded--uni', type: SourceType.ICONIFY },
  MKR: { path: 'token-branded--mkr', type: SourceType.ICONIFY },
  LDO: { path: 'token-branded--ldo', type: SourceType.ICONIFY },
  USDC: { path: 'token-branded--usdc', type: SourceType.ICONIFY },
  USDT: { path: 'token-branded--usdt', type: SourceType.ICONIFY },
  DAI: { path: 'token-branded--DAI', type: SourceType.ICONIFY },
  AVAX: { path: 'token-branded--avax', type: SourceType.ICONIFY },

  BASE: { path: '/icons/base.png', type: SourceType.IMAGE_URL },
  xDAI: { path: '/icons/xdai.png', type: SourceType.IMAGE_URL },
};

const CHAIN_ID_LOGO_MAP: Record<string, LogoSource> = {
  [mainnet.id]: { path: 'token-branded--eth', type: SourceType.ICONIFY },
  [polygon.id]: { path: 'token-branded--polygon', type: SourceType.ICONIFY },
  [arbitrum.id]: { path: 'token-branded--arbitrum-one', type: SourceType.ICONIFY },
  [base.id]: { path: '/icons/base.png', type: SourceType.IMAGE_URL },
  [optimism.id]: { path: 'token-branded--optimism', type: SourceType.ICONIFY },
  [bsc.id]: { path: 'token-branded--bnb', type: SourceType.ICONIFY },
  [avalanche.id]: { path: 'token-branded--avax', type: SourceType.ICONIFY },
  [gnosis.id]: { path: 'token-branded--gnosis', type: SourceType.ICONIFY },
  [fantom.id]: { path: 'token-branded--fantom', type: SourceType.ICONIFY },
  [zksync.id]: { path: 'token-branded--zksync', type: SourceType.ICONIFY },
  [sepolia.id]: { path: 'token-branded--eth', type: SourceType.ICONIFY }, // todo remove
};

const LogoSource = ({ source, size }: { source: LogoSource | string, size: number }) => {
  if (typeof source === 'string') {
    return <div className="flex-center size-full rounded-full bg-gray-400 dark:bg-gray-200">{source}</div>;
  }
  return source.type === SourceType.IMAGE_URL
    ? <Image src={source.path} width={size} height={size} alt="tokenIcon" />
    : <span className={`iconify-color ${source.path} size-full`} />;
};

export const TokenLogo: React.FC<{ symbol: string, chainId: number }> = ({ symbol, chainId }) => {
  const isNative = TOKEN_LOGO_MAP[symbol]?.path === CHAIN_ID_LOGO_MAP[chainId].path;
  return (
    <div className="size-8 relative">
      <LogoSource source={TOKEN_LOGO_MAP[symbol] || symbol} size={32} />
      {!isNative && (
        <div className="absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex-center">
          <LogoSource source={CHAIN_ID_LOGO_MAP[chainId] || chainId} size={8} />
        </div>
      )}
    </div>
  );
};

export const NetworkLogo: React.FC<{ chainId: number }> = ({ chainId }) => {
  return (
    <div className="size-8 relative">
      <LogoSource source={CHAIN_ID_LOGO_MAP[chainId] || chainId} size={32} />
    </div>
  );
};
