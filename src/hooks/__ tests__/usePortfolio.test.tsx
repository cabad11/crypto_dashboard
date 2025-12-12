import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import { test } from '@/tests/mocks/browser';
import { usePortfolio } from '@/hooks/usePortfolio';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ERC20_TOKENS } from '@/constants/tokens';

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    useConnection: vi.fn(() => ({
      isConnected: true,
      address: '0x0000000000000000000000000000000002351113',
    })),
    useReadContracts: vi.fn(() => ({
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
    })),
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
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
  test('aggregates native token and ERC-20 balances across all supported chains', async () => {
    const { result } = renderHook(() => usePortfolio(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    const total = result.current.data?.totalUSD;
    expect(total).toBeGreaterThanOrEqual(6800); // ~1.5×3200 + 2000$ стейблов
    expect(total).toBeLessThan(7000);
  });

  test('correctly converts balances to USD using CoinGecko prices', async () => {
    const { result } = renderHook(() => usePortfolio(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    const change = result.current.data?.change24h;
    expect(change).toBeGreaterThanOrEqual(1.764705882); // (~1.5×2.5 / 6800) * 100
    expect(change).toBeLessThan(2);
  }, 10000);

  test('filters out dust balances below 0.0001 tokens', async () => {
    const { result } = renderHook(() => usePortfolio(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    const assets = result.current.data?.assets || [];
    const hasAave = assets.some(asset => asset.symbol === 'AAVE');
    expect(hasAave).toBe(false);
  });
});
