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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {isPending && (
        [...Array(8)].map((_, i) => (
          <div key={i} className="h-40 skeleton-loader rounded-xl" />
        ))
      )}
      {assets.map(asset => (
        <PortfolioCard key={asset.chainId + asset.symbol} asset={asset} />
      ))}
    </div>
  );
}
