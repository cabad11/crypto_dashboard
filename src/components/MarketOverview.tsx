'use client';

import { useCoingeckoPrices } from '@/hooks/useCoingeckoPrices';
import { TokenLogo } from './ui/TokenLogo';
import { bsc, mainnet } from 'wagmi/chains';

export default function MarketOverview() {
  const { data: prices } = useCoingeckoPrices();
  const marketData = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: prices?.ETH?.price,
      change: prices?.ETH?.change24h,
      icon: <TokenLogo symbol="ETH" chain={mainnet} />,
    },
    {
      name: 'BNB',
      symbol: 'BNB',
      price: prices?.BNB?.price,
      change: prices?.BNB?.change24h,
      icon: <TokenLogo symbol="BNB" chain={bsc} />,
    },
    {
      name: 'Polygon',
      symbol: 'POL',
      price: prices?.POL?.price,
      change: prices?.POL?.change24h,
      icon: <TokenLogo symbol="POL" chain={mainnet} />,
    },
  ];

  return (
    <div className={`
      rounded-xl border border-gray-200/60 bg-white p-4 shadow-sm
      dark:border-gray-800/60 dark:bg-neutral-950
    `}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-standard">Market</h3>
          <p className="mt-0.5 text-xs text-interactive">Live prices</p>
        </div>
        <div className={`
          flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1
          dark:bg-emerald-950/30
        `}
        >
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className={`
            text-xs font-medium text-emerald-600
            dark:text-emerald-400
          `}
          >
            Live
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {marketData.map((coin, i) => {
          if (!coin.price || !coin.change) return (
            <div
              key={i}
              className="h-16 w-full skeleton-loader"
            />
          );
          const isPositive = coin.change >= 0;
          return (
            <div
              key={coin.symbol}
              className={`
                group rounded-lg border border-gray-200/60 bg-gray-50/50 p-3
                transition-all duration-300
                hover:border-gray-300 hover:bg-gray-50
                dark:border-gray-800/60 dark:bg-gray-900/50
                dark:hover:border-gray-700 dark:hover:bg-gray-900
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex-center h-8 w-8 rounded-full">
                    {coin.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-standard">{coin.symbol}</p>
                    <p className="text-xs text-interactive">
                      $
                      {coin.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                    isPositive
                      ? `
                        bg-green-100 text-green-700
                        dark:bg-green-950/30 dark:text-green-400
                      `
                      : `
                        bg-red-100 text-red-700
                        dark:bg-red-950/30 dark:text-red-400
                      `
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {coin.change.toFixed(2)}
                  %
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
