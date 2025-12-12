'use client';
import { CHAINS } from '@/constants/chains';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

import { NetworkLogo } from './TokenLogo';
type Chain = typeof CHAINS[number];
const ChainSelect = ({ chain, onChange }: { chain: Chain, onChange: (chain: Chain) => void }) => {
  return (
    <div className="w-32 md:w-50  bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-standard focus:outline-none">
      <Listbox value={chain} onChange={onChange}>
        <ListboxButton className="w-full flex items-center gap-3 focus:outline-none truncate">
          <NetworkLogo chain={chain} />
          {chain.name}
          <span className="iconify line-md--chevron-down text-standard ml-auto"></span>
        </ListboxButton>
        <ListboxOptions anchor="bottom" className="w-32 md:w-48 p-1  scrollbar-standard background-standard shadow-lg ring-standard focus:outline-none text-standard flex flex-col gap-2 rounded-md mt-3 max-h-60 overflow-y-auto">
          {CHAINS.map(chain => (
            <ListboxOption key={chain.id} value={chain} className="w-full flex items-center gap-3">
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
