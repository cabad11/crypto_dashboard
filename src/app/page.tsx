import PortfolioChart from '@/components/PortfolioChart';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import TransactionsHistory from '@/components/TransactionsHistory';

export default function Home() {
  return (
    <main className="page-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2"><PortfolioChart /></div>
        <TransactionsHistory />
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-standard mb-4">Your Assets</h3>
        <PortfolioGrid />
      </div>
    </main>
  );
}
