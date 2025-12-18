import { CHAINS } from '@/constants/chains';
import COINGECKO_ID_MAP from '@/constants/coingeckoIdMap';
import { ERC20_TOKENS } from '@/constants/tokens';
import { useQuery } from '@tanstack/react-query';

type CoingeckoPrices = Record<string, { usd: number, usd_24h_change: number }>;

type PriceData = {
  price: number
  change24h: number
};
type SYMBOLS = keyof typeof COINGECKO_ID_MAP | 'USDC' | 'USDT' | 'DAI';

export const useCoingeckoPrices = () => {
  const symbols = new Set<SYMBOLS>();

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

      const prices: Partial<Record<SYMBOLS, PriceData>> = {};

      Object.entries(data).forEach(([id, value]) => {
        const symbol = Object.entries(COINGECKO_ID_MAP).find(([, v]) => v === id)?.[0] as SYMBOLS | undefined;
        if (symbol) prices[symbol] = {
          price: value.usd,
          change24h: value.usd_24h_change || 0,
        };
      });

      ['USDC', 'USDT', 'DAI'].forEach((sym) => {
        if (!prices[sym as 'USDC' | 'USDT' | 'DAI']) {
          prices[sym as 'USDC' | 'USDT' | 'DAI'] = { price: 1, change24h: 0 };
        }
      });

      return prices as Record<SYMBOLS, PriceData>;
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
};
