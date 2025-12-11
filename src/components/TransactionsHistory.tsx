'use client';

import { useState } from 'react';
import { useConnection } from 'wagmi';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useTransactionHistory } from '@/hooks/useTransactionsHistory';
import RefreshButton from './ui/RefreshButton';
import ChainSelect from './ui/ChainSelect';
import { CHAINS } from '@/constants/chains';
import clsx from 'clsx';
import ErrorMessage from './ui/ErrorMessage';

enum TransactionType {
  SENT,
  RECEIVED,
  CALL_CONTRACT,
}

export function TransactionHistory() {
  const { address } = useConnection();
  const [chain, setChain] = useState(CHAINS[0]);
  const { data, refresh, isPending, isError, refetch } = useTransactionHistory(chain.id);

  return (
    <div className="card-standard">
      <RefreshButton onClick={refresh} className="w-10 h-10" />
      <ChainSelect chain={chain} onChange={setChain} />
      <div className="flex flex-col gap-2 mt-4 max-h-96 overflow-y-auto">
        {isError && (
          <ErrorMessage message="Failed to load transactions" refetch={refetch} />
        )}
        {isPending
          && ([...Array(5)].map((_, i) => (
            <div key={i} className="h-10 skeleton-loader rounded-xl" />
          ))
          )}
        {data?.pages?.[0].length === 0
          ? (
              <p className="p-8 text-center text-interactive opacity-70">No transactions yet</p>
            )
          : (
              data?.pages.flat().map((tx) => {
                let transactionType: TransactionType;
                if (tx.functionName) {
                  transactionType = TransactionType.CALL_CONTRACT;
                }
                else if (tx.from.toLowerCase() === address?.toLowerCase()) {
                  transactionType = TransactionType.SENT;
                }
                else {
                  transactionType = TransactionType.RECEIVED;
                }
                const isOutgoing = tx.from.toLowerCase() === address?.toLowerCase();
                const explorer = chain?.blockExplorers.default.url || 'https://etherscan.io';

                return (
                  <Link
                    href={`${explorer}/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={tx.hash}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition rounded-lg p-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 flex-center rounded-full ${isOutgoing ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                          <span className={clsx('iconify material-symbols-light--arrow-right-alt w-5 h-5 text-red-600 dark:text-red-400 transform-gpu',
                            isOutgoing ? 'text-red-600 dark:text-red-400 rotate-90' : 'text-green-600 dark:text-green-400 -rotate-90')}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-standard">
                            {transactionType === TransactionType.CALL_CONTRACT && `Call ${tx.functionName?.split('(')[0]}`}
                            {transactionType === TransactionType.SENT && `Sent ${chain.nativeCurrency.symbol}`}
                            {transactionType === TransactionType.RECEIVED && `Received ${chain.nativeCurrency.symbol}`}
                          </p>
                          <p className="text-sm text-interactive opacity-70">
                            {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex">
                        <p className={`font-semibold ${isOutgoing ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          {isOutgoing ? '-' : '+'}
                          {Number((Number(tx.value) / 10 ** chain.nativeCurrency.decimals).toFixed(6))}
                          {' '}
                          {chain.nativeCurrency.symbol}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
      </div>
    </div>
  );
}

export default TransactionHistory;
