import { renderHook } from 'vitest-browser-react';
import { describe, expect, vi, beforeEach } from 'vitest';
import { it } from '@/tests/mocks/browser';
import { usePortfolio } from '@/hooks/usePortfolio';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ERC20_TOKENS } from '@/constants/tokens';
import { useConnection, useReadContracts } from 'wagmi';
import { getBalance } from 'wagmi/actions';

vi.mock('wagmi');
vi.mock('wagmi/actions');

const mockedUseReadContracts = vi.mocked(useReadContracts);
const mockedGetBalance = vi.mocked(getBalance);
const mockedUseConnection = vi.mocked(useConnection);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const config = createConfig({
    chains: [sepolia, mainnet],
    transports: { [sepolia.id]: http(), [mainnet.id]: http() },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    );
  };
};

describe('usePortfolio', () => {
  beforeEach(() => {
    mockedUseConnection.mockReturnValue({
      isConnected: true,
      address: '0x0000000000000000000000000000000002351113',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGetBalance.mockImplementation((_, { chainId }): any => {
      if (chainId === sepolia.id) return Promise.resolve({ value: 500000000000000000n }); // 0.5 ETH
      return Promise.resolve({ value: 0n });
    });

    mockedUseReadContracts.mockReturnValue({
      data: ERC20_TOKENS.map((token) => {
        if (token.chainId === mainnet.id) {
          if (token.symbol === 'USDC' || token.symbol === 'USDT') return { result: 1000000000n }; // 1000 USDC/USDT
          if (token.symbol === 'WETH') return { result: 1500000000000000000n }; // 1.5 WETH
          if (token.symbol === 'AAVE') return { result: 50000000000000n }; // 0.00005 AAVE (dust)
        }
        return { result: 0n };
      }),
      isPending: false,
      error: null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it('aggregates native token and ERC-20 balances across all supported chains', async () => {
    const { result } = await renderHook(() => usePortfolio(), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => expect(result.current.isPending).toBe(false));

    const total = result.current.data?.totalUSD;
    expect(total).toBeCloseTo(8400, 0); // (0.5 + 1.5)×3200 + 2000$ стейблов
  });

  it('correctly converts balances to USD using CoinGecko prices', async () => {
    const { result } = await renderHook(() => usePortfolio(), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => expect(result.current.isPending).toBe(false));

    const change = result.current.data?.change24h;
    expect(change).toBeCloseTo(1.90, 1); // ((0.5 + 1.5)*×3200×2.5 / 8400)
  });

  it('filters out dust balances below 0.0001 tokens', async () => {
    const { result } = await renderHook(() => usePortfolio(), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => expect(result.current.isPending).toBe(false));

    const assets = result.current.data?.assets || [];
    const hasAave = assets.some(asset => asset.symbol === 'AAVE');
    expect(hasAave).toBe(false);
  });
});
