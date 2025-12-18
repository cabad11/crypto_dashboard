'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
const AccountsMenu = dynamic(() => import('./components/AccountsMenu'), { ssr: false });
const ThemeSwitch = dynamic(() => import('./components/ThemeSwitch'), { ssr: false });
const MobileMenu = dynamic(() => import('./components/MobileMenu'), { ssr: false });

export const MENU_ITEMS: { label: string, href: string }[] = [
  { label: 'Dashboard', href: '/' },
  // { label: 'Swap', href: '/swap' },
  // { label: 'Transactions', href: '/history' },
  // { label: 'NFTs', href: '/nft' },
];

const Header = () => {
  return (
    <header
      className={`
        sticky top-0 z-40 w-full border-b border-gray-200/60 bg-stone-100/95
        backdrop-blur-sm
        dark:border-gray-800/60 dark:bg-stone-900/95
      `}
    >
      <div
        className={`
          mx-auto flex h-16 max-w-6xl items-center justify-start gap-3 px-4
          sm:px-6
          lg:px-8
        `}
      >
        <div className="flex w-48 items-center gap-3">
          <div
            className={`
              h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 via-purple-500
              to-pink-500 shadow-md transition-transform
              hover:scale-105 hover:shadow-lg
            `}
          />
          <Link
            href="/"
            className={`
              text-lg font-semibold tracking-tight text-standard
              transition-colors
              hover:text-indigo-600
              dark:hover:text-indigo-400
            `}
          >
            Crypto Tracker
          </Link>
        </div>

        <nav className="hidden items-center gap-2 text-sm md:flex lg:gap-4">
          {MENU_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                rounded-md px-3 py-1.5 font-medium text-gray-700 transition-all
                hover:bg-gray-200/60 hover:text-gray-900
                dark:text-gray-300 dark:hover:bg-gray-800/60
                dark:hover:text-gray-100
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Suspense fallback={(
            <div className="h-9 w-36 skeleton-loader rounded-lg" />
          )}
          >
            <AccountsMenu />
          </Suspense>
          <div className="hidden md:block">
            <ThemeSwitch />
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
