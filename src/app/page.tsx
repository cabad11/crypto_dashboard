import PortfolioChart from '@/components/PortfolioChart';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import TransactionsHistory from '@/components/TransactionsHistory';
import PortfolioSummary from '@/components/PortfolioSummary';
import MarketOverview from '@/components/MarketOverview';

export default function Home() {
  return (
    <main className={`
      page-container mb-6 grid grid-cols-1 gap-6
      xl:grid-cols-3 xl:grid-rows-2
    `}
    >
      <div className="xl:col-span-2">
        <div className="mb-4">
          <h2 className="mb-1 text-2xl font-bold text-standard md:text-3xl">Portfolio Performance</h2>
          <p className="text-sm text-interactive">Monitor your portfolio value over time</p>
        </div>
        <PortfolioChart />
      </div>

      <div className="space-y-4 lg:mt-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-standard">Quick Stats</h3>
          <PortfolioSummary />
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-standard">Recent Activity</h3>
          <TransactionsHistory />
        </div>
      </div>

      <div className="xl:col-span-2">
        <div className="mb-4">
          <h2 className="mb-1 text-2xl font-bold text-standard md:text-3xl">Your Assets</h2>
          <p className="text-sm text-interactive">Complete overview of your holdings</p>
        </div>
        <PortfolioGrid />
      </div>
      <div>
        <div className="mb-4">
          <h2 className="mb-1 text-xl font-bold text-standard md:text-2xl">Market Overview</h2>
          <p className="text-sm text-interactive">Top cryptocurrencies</p>
        </div>
        <MarketOverview />
      </div>
    </main>
  );
}
