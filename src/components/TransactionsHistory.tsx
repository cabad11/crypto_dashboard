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
  const [chain, setChain] = useState<typeof CHAINS[number]>(CHAINS[0]);
  const { data, isPending, isError, refetch } = useTransactionHistory(chain.id);

  return (
    <div className="card-standard">
      <RefreshButton onClick={refetch} className="h-10 w-10" />
      <ChainSelect chain={chain} onChange={setChain} />
      <div className="mt-4 flex max-h-96 flex-col gap-2 overflow-y-auto">
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
                    className={`
                      rounded-lg p-1 transition
                      hover:bg-slate-50
                      dark:hover:bg-slate-700/50
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`
                          flex-center rounded-full p-1
                          ${isOutgoing
                    ? `bg-red-100 dark:bg-red-900/30`
                    : `bg-green-100 dark:bg-green-900/30`}
                        `}
                        >
                          <span className={clsx(`
                            iconify h-5 w-5 transform-gpu
                            material-symbols-light--arrow-right-alt
                          `,
                          isOutgoing
                            ? `rotate-90 text-red-600 dark:text-red-400`
                            : `-rotate-90 text-green-600 dark:text-green-400`)}
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

                      <div className="flex text-right">
                        <p className={`
                          font-semibold
                          ${isOutgoing
                    ? `text-red-600 dark:text-red-400`
                    : `text-green-600 dark:text-green-400`}
                        `}
                        >
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
