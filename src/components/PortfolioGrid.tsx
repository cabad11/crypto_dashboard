'use client';

import { usePortfolio } from '@/hooks/usePortfolio';
import { PortfolioCard } from './PortfolioCard';
import ErrorMessage from './ui/ErrorMessage';

export function PortfolioGrid() {
  const { data, isPending, isError, refetch } = usePortfolio();

  const assets = data?.assets ?? [];
  if (isError) {
    return <ErrorMessage message="Failed to load portfolio" refetch={refetch} />;
  }
  return (
    <div className={`
      grid grid-cols-1 gap-6
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
    `}
    >
      {isPending && (
        [...Array(8)].map((_, i) => (
          <div
            key={i}
            data-testid="asset-skeleton"
            className="h-40 skeleton-loader rounded-xl"
          />
        ))
      )}
      {assets.length === 0 && !isPending && (
        <p className="col-span-full text-center text-gray-500">No assets found</p>)}
      {!isPending && assets.map(asset => (
        <PortfolioCard key={asset.chain.id + asset.symbol} asset={asset} />
      ))}
    </div>
  );
}
