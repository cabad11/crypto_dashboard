import { DialogBackdrop, Dialog, DialogPanel } from '@headlessui/react';

import { MENU_ITEMS } from '../Header';
import Link from 'next/link';
import { useState } from 'react';
import ThemeSwitch from './ThemeSwitch';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex-center md:hidden rounded-md focus:ring-standard">
        <span className="iconify material-symbols-light--menu w-8 h-8" />
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="z-50 fixed top-0 min-h-full w-screen md:hidden">
        <DialogBackdrop
          transition
          className="absolute inset-0 bg-black/30"
        />
        <DialogPanel className="absolute right-0 min-w-1/3 w-min p-4 pt-8 h-screen background-standard rounded-l-md border-r-1 border-gray-200/60 dark:border-gray-800/60">
          <div className="flex justify-between items-center">
            <span className="text-standard text-lg">Theme:</span>
            <ThemeSwitch />
          </div>
          <nav className="flex justify-center flex-col mt-8 divide-y divide-gray-200/60 dark:divide-gray-800/60">
            {MENU_ITEMS.map(item => (
              <Link key={item.href} href={item.href} className="text-standard py-2">{item.label}</Link>
            ))}
          </nav>
        </DialogPanel>
      </Dialog>
    </>
  );
}
