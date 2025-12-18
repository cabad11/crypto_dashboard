'use client';

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
        className={`
          flex-center h-9 w-9 rounded-md transition-colors
          hover:bg-gray-200/60
          focus:ring-1 focus:ring-indigo-400
          md:hidden
          dark:hover:bg-gray-800/60
        `}
      >
        <span className={`
          iconify h-6 w-6 text-gray-700 material-symbols-light--menu
          dark:text-gray-300
        `}
        />
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed top-0 z-50 min-h-full w-screen md:hidden"
      >
        <DialogBackdrop
          transition
          className={`
            absolute inset-0 bg-black/40 backdrop-blur-sm transition
            duration-300 ease-out
            data-closed:opacity-0
          `}
        />
        <DialogPanel
          transition
          className={`
            absolute right-0 h-screen w-72 rounded-l-xl border-l bg-stone-100
            p-6 pt-8 shadow-2xl ring-standard transition duration-300 ease-out
            data-closed:translate-x-full
            dark:bg-stone-900
          `}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-standard">
              Theme
            </span>
            <ThemeSwitch />
          </div>
          <nav
            className={`
              mt-8 flex flex-col justify-center divide-y divide-gray-200/60
              dark:divide-gray-800/60
            `}
          >
            {MENU_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  py-3 font-medium text-gray-700 transition-colors
                  hover:text-indigo-600
                  dark:text-gray-300 dark:hover:text-indigo-400
                `}
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
