'use client';
import { CHAINS } from '@/constants/chains';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

import { NetworkLogo } from './TokenLogo';
type Chain = typeof CHAINS[number];
const ChainSelect = ({ chain, onChange }: { chain: Chain, onChange: (chain: Chain) => void }) => {
  return (
    <div className={`
      w-40 cursor-pointer rounded-lg border border-gray-300 bg-transparent px-2
      py-1 text-standard
      focus:outline-none
      md:w-50
      dark:border-gray-600
    `}
    >
      <Listbox value={chain} onChange={onChange}>
        <ListboxButton className={`
          flex w-full items-center gap-3 truncate
          focus:outline-none
        `}
        >
          <NetworkLogo chain={chain} />
          {chain.name}
          <span className="ml-auto iconify text-standard line-md--chevron-down"></span>
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className={`
            mt-3 scrollbar-standard flex max-h-60 w-40 flex-col gap-2
            overflow-y-auto rounded-md background-standard p-1 text-standard
            shadow-lg ring-standard
            focus:outline-none
            md:w-48
          `}
        >
          {CHAINS.map(chain => (
            <ListboxOption
              key={chain.id}
              value={chain}
              className="flex w-full items-center gap-3"
            >
              <NetworkLogo chain={chain} />
              {chain.name}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
};

export default ChainSelect;
