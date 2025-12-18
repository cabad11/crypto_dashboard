import { describe, expect, vi } from 'vitest';
import { it } from '@/tests/mocks/browser';
import { render } from 'vitest-browser-react';
import { PortfolioGrid } from '../PortfolioGrid';
import { ERC20_TOKENS } from '@/constants/tokens';
import { ASSET_DATA } from '@/hooks/usePortfolio';
import { base, mainnet, polygon } from 'wagmi/chains';

const BASE_TOKEN = ERC20_TOKENS.find(t => t.symbol === 'BASE' && t.chainId === base.id)!;
const USDT_TOKEN = ERC20_TOKENS.find(t => t.symbol === 'USDT' && t.chainId === polygon.id)!;
const mocks = vi.hoisted(() => {
  return {
    usePortfolio: vi.fn<() => {
      data?: { assets?: ASSET_DATA[] }
      isPending: boolean
      isError: boolean
      refetch: () => void }>(() => {
      return { data: {
        assets: [
          { chain: base,
            name: undefined,
            symbol: BASE_TOKEN.symbol,
            change24h: 0.01,
            balance: '1000',
            valueUSD: 1000,
          },
          { chain: mainnet,
            name: mainnet.nativeCurrency.name,
            symbol: mainnet.nativeCurrency.symbol,
            change24h: -2,
            balance: '1.5',
            valueUSD: 4800,
          },
          { chain: polygon,
            name: USDT_TOKEN.name,
            symbol: USDT_TOKEN.symbol,
            change24h: 0,
            balance: '200',
            valueUSD: 200,
          },
        ],
      }, isPending: false, isError: false, refetch: () => {} };
    }),
  };
});

vi.mock('@/hooks/usePortfolio', () => ({
  usePortfolio: mocks.usePortfolio,
}));

describe('PortfolioGrid', () => {
  it('renders loading skeleton when isPending is true', async () => {
    await mocks.usePortfolio.withImplementation(() => ({
      data: undefined,
      isPending: true,
      isError: false,
      refetch: () => {} }), async () => {
      const screen = await render(<PortfolioGrid />);
      const skeletons = await screen.getByTestId('asset-skeleton');
      await expect.element(skeletons.first()).toBeInTheDocument();
      expect(skeletons.all()).toHaveLength(8);
    });
  });

  it('displays "No assets found" when portfolio is empty', async () => {
    await mocks.usePortfolio.withImplementation(() => ({
      data: { assets: [] },
      isPending: false,
      isError: false,
      refetch: () => {} }), async () => {
      const screen = await render(<PortfolioGrid />);
      await expect.element(screen.getByText('No assets found')).toBeInTheDocument();
    });
  });

  it('displays token symbol, chain name, balance, usd value, 24h change correctly', async () => {
    const screen = await render(<PortfolioGrid />);

    await expect.element(screen.getByRole('heading', { name: 'Ether(ETH)' })).toBeInTheDocument();
    await expect.element(screen.getByRole('heading', { name: 'BASE' })).toBeInTheDocument();
    await expect.element(screen.getByRole('heading', { name: 'Tether(USDT)' })).toBeInTheDocument();

    // Network names
    await expect.element(screen.getByText(mainnet.name, { exact: true })).toBeInTheDocument();
    await expect.element(screen.getByText(base.name, { exact: true }), {}).toBeInTheDocument();
    await expect.element(screen.getByText(polygon.name, { exact: true }), {}).toBeInTheDocument();

    // Token balances and USD values
    await expect.element(screen.getByText('1.50 ETH', { exact: true })).toBeInTheDocument();
    await expect.element(screen.getByText('$4,800.00', { exact: true })).toBeInTheDocument();
    await expect.element(screen.getByText('1,000.00 BASE', { exact: true })).toBeInTheDocument();
    await expect.element(screen.getByText('$1,000.00', { exact: true })).toBeInTheDocument();
    await expect.element(screen.getByText('200.00 USDT', { exact: true })).toBeInTheDocument();
    await expect.element(screen.getByText('$200.00', { exact: true })).toBeInTheDocument();

    // 24h change
    await expect.element(screen.getByText('-2.00%', { exact: true })).toBeInTheDocument();
    await expect.element(screen.getByText('+0.01%', { exact: true })).toBeInTheDocument();
  });

  it('show token and network logo correctly', async () => {
    const screen = await render(<PortfolioGrid />);

    const images = await screen.getByRole('img').elements();
    expect(images).toHaveLength(4); // 3 tokens + 1 network(BASE)
    await expect.element(screen.getByAltText('BASE Icon')).toBeInTheDocument();
    await expect.element(screen.getByLabelText('ETH Icon')).toBeInTheDocument();
    await expect.element(screen.getByLabelText('USDT Icon')).toBeInTheDocument();
    await expect.element(screen.getByLabelText('Polygon Network Icon')).toBeInTheDocument();
  });
});
