import PortfolioChart from '@/components/PortfolioChart';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import TransactionsHistory from '@/components/TransactionsHistory';

export default function Home() {
  return (
    <main className="page-container">
      <div className={`
        grid grid-cols-1 gap-8
        lg:grid-cols-3
      `}
      >
        <div className="lg:col-span-2"><PortfolioChart /></div>
        <TransactionsHistory />
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-standard">Your Assets</h2>
        <PortfolioGrid />
      </div>
    </main>
  );
}
