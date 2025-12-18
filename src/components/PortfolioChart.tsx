'use client';
import { usePortfolio } from '@/hooks/usePortfolio';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePortfolioHistory, type Period, DAYS_MAP } from '@/hooks/usePortfolioHistory';
import { useState } from 'react';
import RefreshButton from './ui/RefreshButton';
import ErrorMessage from './ui/ErrorMessage';

const PortfolioChart = () => {
  const [period, setPeriod] = useState<Period>('7d');
  const { data, refresh, isPending } = usePortfolio();
  const history = usePortfolioHistory(period);
  const isPositive = data ? data.change24h >= 0 : true;
  const dateFormatter = (date: number) => {
    const options: Intl.DateTimeFormatOptions = {};
    if (period === '1d') {
      return new Date(date).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    }
    if (period === '7d') {
      options.weekday = 'short';
    }
    if (period === '30d' || period === '90d') {
      options.day = '2-digit';
    }
    return new Date(date).toLocaleDateString('en', options);
  };

  return (
    <div className="card-standard">
      <RefreshButton onClick={refresh} />
      <div className="mb-6">
        <h2 className="mb-2 text-base font-medium text-interactive md:text-lg">Total Portfolio Value</h2>
        {isPending
          ? (
              <div className="h-12 w-64 skeleton-loader md:h-16" />
            )
          : (
              <div className="flex items-baseline gap-3">
                <div className={`
                  text-3xl font-bold tracking-tight text-standard
                  md:text-5xl
                  lg:text-6xl
                `}
                >
                  $
                  {data?.totalUSD.toLocaleString('en-US', { currency: 'USD' })}
                </div>
                <div
                  className={`
                    flex items-center gap-1.5 rounded-lg px-3 py-0.5 text-sm
                    font-semibold
                    md:text-base
                    lg:py-1.5
                    ${
              isPositive
                ? `
                  bg-green-100 text-green-700
                  dark:bg-green-950/30 dark:text-green-400
                `
                : `bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400`
              }`}
                >
                  <span className="text-base md:text-lg">{(data?.change24h as number) > 0 ? '↑' : '↓'}</span>
                  {Math.abs(data?.change24h as number).toFixed(2)}
                  % (24h)
                </div>
              </div>
            )}
      </div>

      <div className={`
        -mx-6 h-64 w-full text-xs
        md:-mx-3 md:h-80 md:text-sm
        lg:h-96
      `}
      >
        {history.isError && <ErrorMessage message="Failed to load history data" refetch={history.refetch} />}
        {history.isPending && (
          <div className="h-full w-full skeleton-loader rounded-2xl" />
        )}
        {history?.history && history?.history?.length !== 0 && (
          <>
            <div className="flex items-center justify-end gap-2 md:gap-3">
              {Object.keys(DAYS_MAP).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as Period)}
                  className={`
                    rounded-lg px-3 py-1.5 text-xs font-medium transition-all
                    duration-200
                    md:px-4 md:py-2 md:text-sm
                    ${
                period === p
                  ? `
                    bg-linear-to-r from-emerald-500 to-cyan-500 text-white
                    shadow-md
                  `
                  : `
                    bg-gray-100 text-gray-700
                    hover:bg-gray-200
                    dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700
                  `
                }`}
                >
                  {p === 'all' ? 'All Time' : p.toUpperCase()}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history.history} margin={{ top: 10, right: 10, bottom: 20 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  className="dark:stroke-gray-800"
                />
                <XAxis dataKey="date" tickFormatter={dateFormatter} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  formatter={(v: number) => [`$${v.toFixed(2)}`, 'USD amount']}
                  labelFormatter={date => new Date(date).toLocaleString('en')}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: 'white' }}
                />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default PortfolioChart;
