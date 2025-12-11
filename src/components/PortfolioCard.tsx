'use client';

import { ASSET_DATA } from '@/hooks/usePortfolio';
import { TokenLogo } from './ui/TokenLogo';

export function PortfolioCard({ asset }: { asset: ASSET_DATA }) {
  const isPositive = asset.change24h >= 0;

  return (
    <div className="background-standard ring-standard rounded-3xl p-6 shadow hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4 mb-5">
        <TokenLogo chainId={asset.chainId} symbol={asset.symbol} />
        <div>
          {asset.name && (<h3 className="font-semibold text-standard">{asset.name}</h3>)}
          <p className="text-sm text-interactive">{asset.symbol}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-standard">
          $
          {asset.valueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-interactive">
          {asset.balance.toLocaleString()}
          {' '}
          {asset.symbol}
        </p>
        <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}
          {asset.change24h.toFixed(2)}
          %
        </p>
      </div>
    </div>
  );
}
