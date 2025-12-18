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
  SENT = 0,
  RECEIVED = 1,
  CALL_CONTRACT = 2,
}

export function TransactionHistory() {
  const { address } = useConnection();
  const [chain, setChain] = useState<(typeof CHAINS)[number]>(CHAINS[0]);
  const { data, isPending, isError, refetch } = useTransactionHistory(chain.id);

  return (
    <div className="card-standard">
      <div className="mb-6 flex items-center justify-between">
        <ChainSelect chain={chain} onChange={setChain} />
        <RefreshButton onClick={refetch} className="h-10 w-10" />
      </div>

      <div className={`
        -mx-2 scrollbar-standard max-h-80 space-y-1 overflow-y-auto
      `}
      >
        {isError && <ErrorMessage message="Failed to load transactions" refetch={refetch} />}
        {isPending && [...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 skeleton-loader rounded-xl"
          />
        ))}
        {data?.pages?.[0].length === 0
          ? (
              <div className="flex-center flex-col gap-2 py-12">
                <div className={`
                  flex-center h-12 w-12 rounded-full bg-gray-100
                  dark:bg-gray-800
                `}
                >
                  <span className={`
                    iconify h-6 w-6 text-gray-400
                    material-symbols-light--receipt-long
                  `}
                  />
                </div>
                <p className="text-center text-sm text-interactive opacity-70">No transactions yet</p>
                <p className="text-center text-xs text-interactive opacity-50">Your activity will appear here</p>
              </div>
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
                    className={`
                      block rounded-xl border border-transparent p-3
                      transition-all duration-200
                      hover:border-gray-200 hover:bg-gray-50/50 hover:shadow-sm
                      dark:hover:border-gray-800 dark:hover:bg-gray-800/30
                    `}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div
                          className={`
                            flex-center h-10 w-10 shrink-0 rounded-full
                            transition-transform duration-200
                            ${isOutgoing
                    ? `bg-red-100 dark:bg-red-900/30`
                    : `bg-green-100 dark:bg-green-900/30`}
                        `}
                        >
                          <span
                            className={clsx(
                              `
                                iconify h-5 w-5 transform-gpu
                                transition-transform duration-200
                                material-symbols-light--arrow-right-alt
                              `,
                              isOutgoing
                                ? `rotate-90 text-red-600 dark:text-red-400`
                                : `
                                  -rotate-90 text-green-600
                                  dark:text-green-400
                                `,
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`
                            truncate text-sm font-semibold text-standard
                          `}
                          >
                            {transactionType === TransactionType.CALL_CONTRACT && `Call ${tx.functionName?.split('(')[0]}`}
                            {transactionType === TransactionType.SENT && `Sent ${chain.nativeCurrency.symbol}`}
                            {transactionType === TransactionType.RECEIVED && `Received ${chain.nativeCurrency.symbol}`}
                          </p>
                          <p className="text-xs text-interactive opacity-60">
                            {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <div className="text-right">
                          <p
                            className={`
                            text-sm font-bold tabular-nums
                            ${isOutgoing
                    ? `text-red-600 dark:text-red-400`
                    : `text-green-600 dark:text-green-400`}
                          `}
                          >
                            {isOutgoing ? '-' : '+'}
                            {Number((Number(tx.value) / 10 ** chain.nativeCurrency.decimals).toFixed(6))}
                          </p>
                          <p className="text-xs text-interactive opacity-50">{chain.nativeCurrency.symbol}</p>
                        </div>
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
