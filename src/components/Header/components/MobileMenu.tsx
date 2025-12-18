import { DialogBackdrop, Dialog, DialogPanel } from '@headlessui/react';

import { MENU_ITEMS } from '../Header';
import Link from 'next/link';
import { useState } from 'react';
import ThemeSwitch from './ThemeSwitch';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-center rounded-md focus:ring-standard md:hidden"
      >
        <span className="iconify h-8 w-8 material-symbols-light--menu" />
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed top-0 z-50 min-h-full w-screen md:hidden"
      >
        <DialogBackdrop
          transition
          className="absolute inset-0 bg-black/30"
        />
        <DialogPanel className={`
          absolute right-0 h-screen w-min min-w-1/3 rounded-l-md border-r-1
          border-gray-200/60 background-standard p-4 pt-8
          dark:border-gray-800/60
        `}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg text-standard">Theme:</span>
            <ThemeSwitch />
          </div>
          <nav className={`
            mt-8 flex flex-col justify-center divide-y divide-gray-200/60
            dark:divide-gray-800/60
          `}
          >
            {MENU_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-standard"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </DialogPanel>
      </Dialog>
    </>
  );
}
