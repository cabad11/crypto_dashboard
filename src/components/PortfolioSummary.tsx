'use client';

import { usePortfolio } from '@/hooks/usePortfolio';

export default function PortfolioSummary() {
  const { data, isPending } = usePortfolio();

  const bestPerformer = data?.assets.length
    ? data.assets.reduce((max, asset) => (asset.change24h > max.change24h ? asset : max))
    : null;

  const stats = [
    {
      label: 'Total Assets',
      value: data?.assets.length ?? 0,
      icon: 'material-symbols-light--account-balance-wallet',
      color: 'emerald',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
      iconClass: 'text-emerald-600 dark:text-emerald-400',
      ringClass: 'ring-emerald-100 dark:ring-emerald-900/50',
    },
    {
      label: 'Best Token',
      value: bestPerformer && (
        <div className="flex items-center gap-1">
          {bestPerformer?.symbol}
          <div
            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
              bestPerformer?.change24h >= 0
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
            {bestPerformer?.change24h >= 0 ? '+' : ''}
            {bestPerformer?.change24h.toFixed(2)}
            %
          </div>
        </div>
      ),
      icon: 'material-symbols-light--trending-up',
      color: 'cyan',
      bgClass: 'bg-cyan-50 dark:bg-cyan-950/30',
      iconClass: 'text-cyan-600 dark:text-cyan-400',
      ringClass: 'ring-cyan-100 dark:ring-cyan-900/50',
    },
    {
      label: 'Total Chains',
      value: data?.assets.length ? new Set(data.assets.map(a => a.chain.id)).size : 0,
      icon: 'material-symbols-light--link',
      color: 'violet',
      bgClass: 'bg-violet-50 dark:bg-violet-950/30',
      iconClass: 'text-violet-600 dark:text-violet-400',
      ringClass: 'ring-violet-100 dark:ring-violet-900/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:gap-2">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="card-standard xl:p-2"
        >

          <div className={`
            relative flex size-full items-center justify-between gap-3
          `}
          >
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-medium text-interactive">{stat.label}</p>
              {isPending
                ? (
                    <div className="h-7 w-20 skeleton-loader" />
                  )
                : (
                    <div>
                      <span className={`
                        text-xl leading-tight font-bold tracking-tight
                        text-standard
                        xl:text-sm
                      `}
                      >
                        {stat.value}
                      </span>

                    </div>
                  )}
            </div>
            <div
              className={`
                flex-center h-10 w-10 shrink-0 rounded-lg ring-2
                transition-transform duration-300
                xl:hidden
                ${stat.bgClass}
                ${stat.ringClass}
              `}
            >
              <span className={`iconify h-5 w-5 ${stat.icon} ${stat.iconClass}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
