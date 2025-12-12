'use client';

import { useConnection, useReadContracts } from 'wagmi';
import { useMemo } from 'react';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBalance } from 'wagmi/actions';
import { config } from '@/utils/web3/wagmiConfig';
import { ERC20_TOKENS } from '@/constants/tokens';
import { CHAINS } from '@/constants/chains';
import { formatUnits } from 'viem';
import COINGECKO_ID_MAP from '@/constants/coingeckoIdMap';

export type ASSET_DATA = {
  chain: typeof CHAINS[number]
  name?: string
  symbol: keyof typeof COINGECKO_ID_MAP
  balance: string
  valueUSD: number
  change24h: number
};

type PriceData = {
  price: number
  change24h: number
};

type CoingeckoPrices = Record<string, { usd: number, usd_24h_change: number }>;

export const useCoingeckoPrices = () => {
  const symbols = new Set<keyof typeof COINGECKO_ID_MAP>();

  CHAINS.forEach((chain) => {
    symbols.add(chain.nativeCurrency.symbol);
  });

  ERC20_TOKENS.forEach((token) => {
    symbols.add(token.symbol);
  });
  return useQuery({
    queryKey: ['prices'],
    queryFn: async () => {
      const ids = Array.from(symbols)
        .map(sym => COINGECKO_ID_MAP[sym] ?? sym.toLowerCase())
        .filter(Boolean)
        .join(',');
      const vs = 'usd';
      const res = await fetch(`/api/coingecko/simple/price?ids=${ids}&vs_currencies=${vs}&include_24hr_change=true`);
      if (!res.ok) throw new Error('Coingecko rate limit or error');
      const data: CoingeckoPrices = await res.json();

      const prices: Record<string, PriceData> = {};

      Object.entries(data).forEach(([id, value]) => {
        const symbol = Object.entries(COINGECKO_ID_MAP).find(([, v]) => v === id)?.[0];
        if (symbol) prices[symbol] = {
          price: value.usd,
          change24h: value.usd_24h_change || 0,
        };
      });

      ['USDC', 'USDT', 'DAI'].forEach((sym) => {
        if (!prices[sym]) {
          prices[sym] = { price: 1, change24h: 0 };
        }
      });

      return prices;
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
};

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;

export function usePortfolio() {
  const { address, isConnected } = useConnection();
  const queryClient = useQueryClient();
  const { data: prices, isError: pricesIsErr, refetch: pricesRefetch, error: pricesErr, isPending: pricesIsPending } = useCoingeckoPrices();

  const { data: erc20Data, isPending: erc20IsPending, isError: erc20IsError, refetch: erc20Refetch, error: erc20Error } = useReadContracts({
    contracts: ERC20_TOKENS.map(t => ({
      chainId: t.chainId,
      address: t.address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address!],
    })),
    query: { enabled: isConnected && !!address },
  });

  const nativeResults = useQueries({ queries: CHAINS.map(chain => ({
    queryKey: ['native', chain.id, address],
    queryFn: () => getBalance(config, { address: address!, chainId: chain.id }),
    enabled: isConnected && !!address,
  })),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    queryClient.invalidateQueries({ queryKey: ['prices'] });
    queryClient.invalidateQueries({ queryKey: ['native'] });
  };

  const isPending = erc20IsPending || nativeResults.some(r => r.isPending) || !isConnected || pricesIsPending;
  const portfolio = useMemo(() => {
    if (isPending || !prices) return null;

    const assets: ASSET_DATA[] = [];
    let totalUSD = 0;
    let weightedChange = 0;

    nativeResults.forEach((res, i) => {
      const chain = CHAINS[i];
      const balance = res.data ? formatUnits(res.data.value, chain.nativeCurrency.decimals) : '0';

      if (+balance > 0.0001) {
        const symbol = chain.nativeCurrency.symbol;
        const price = prices[symbol].price || 0;
        const valueUSD = +balance * price;
        totalUSD += valueUSD;
        weightedChange += valueUSD * prices[symbol].change24h;
        assets.push({
          chain: chain,
          change24h: prices[symbol].change24h,
          symbol,
          name: chain.nativeCurrency.name,
          balance,
          valueUSD,
        });
      }
    });

    erc20Data?.forEach((result, i) => {
      const token = ERC20_TOKENS[i];
      const balanceRaw = result.result;
      const balance = formatUnits(balanceRaw ?? BigInt(0), token.decimals);

      if (+balance > 0.0001) {
        const chain = CHAINS.find(c => c.id === token.chainId)!;
        const price = prices[token.symbol].price || 1;
        const valueUSD = +balance * price;
        totalUSD += valueUSD;
        weightedChange += valueUSD * prices[token.symbol].change24h;
        assets.push({
          chain: chain,
          name: 'name' in token ? token.name : undefined,
          symbol: token.symbol,
          change24h: prices[token.symbol].change24h,
          balance,
          valueUSD,
        });
      }
    });

    const totalChange24h = totalUSD > 0 ? weightedChange / totalUSD : 0;

    return { totalUSD, assets, change24h: totalChange24h };
  }, [isPending, prices, erc20Data, nativeResults]);

  const isError = nativeResults.some(r => r.isError) || erc20IsError || pricesIsErr;
  if (isError) {
    console.error('Portfolio error message', erc20Error, pricesIsErr);
  }

  const refetch = () => {
    if (pricesErr) pricesRefetch();
    if (erc20IsError) erc20Refetch();
    nativeResults.forEach((r) => {
      if (r.isError) r.refetch();
    });
  };

  return { data: portfolio, isPending, refresh, isError, refetch };
}
