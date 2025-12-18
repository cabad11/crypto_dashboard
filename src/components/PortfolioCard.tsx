'use client';

import type { ASSET_DATA } from '@/hooks/usePortfolio';
import { TokenLogo } from './ui/TokenLogo';

export function PortfolioCard({ asset }: { asset: ASSET_DATA }) {
  const isPositive = asset.change24h >= 0;

  return (
    <div className="card-standard overflow-hidden">
      <div className="flex flex-col">
        <div className="mb-4 flex items-center gap-3">
          <TokenLogo chain={asset.chain} symbol={asset.symbol} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-standard">
              {asset.name || asset.symbol}
              {asset.name && (
                <span className="ml-1 text-xs text-interactive">
                  (
                  {asset.symbol}
                  )
                </span>
              )}
            </h3>
            <p className="truncate text-xs text-interactive">{asset.chain.name}</p>
          </div>

        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-standard">
              $
              {asset.valueUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {!!asset.change24h && (
              <div
                className={`
                  flex-center shrink-0 rounded-lg px-2.5 py-1 text-xs
                  font-semibold
                  ${
              isPositive
                ? `
                  bg-green-100 text-green-700
                  dark:bg-green-950/30 dark:text-green-400
                `
                : `bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400`
              }`}
              >
                {isPositive ? '+' : ''}
                {asset.change24h.toFixed(2)}
                %
              </div>
            )}
          </div>

          <div className={`
            flex items-baseline justify-between gap-1 rounded-lg bg-gray-100
            px-3 py-2.5
            dark:bg-gray-900/50
          `}
          >
            <span className="text-xs font-medium text-interactive">Balance:</span>
            <span className="text-sm font-semibold text-nowrap text-standard">
              {Number(asset.balance).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}
              {' '}
              {asset.symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
