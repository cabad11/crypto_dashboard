'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useConnection } from 'wagmi';

export type Transaction = {
  hash: string
  from: string
  to: string | null
  value: string
  timestamp: string
  chainId: number
  functionName: string | null
};

export function useTransactionHistory(chainId: number) {
  const { address, isConnected } = useConnection();
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['txs', chainId, address] });
  };

  const result = useInfiniteQuery<Transaction[]>({
    queryKey: ['txs', chainId, address],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/transactions?address=${address}&chainId=${chainId}&page=${pageParam}`);
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam as number + 1;
    },
    initialPageParam: 1,
    enabled: isConnected && !!address,
  });

  return { ...result, refresh };
}
