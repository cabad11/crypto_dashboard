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
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 dark:border-gray-800/60 bg-stone-100 dark:bg-stone-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-left gap-3">
        <div className="flex w-48 items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
          <Link href="/" className="text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">Crypto Tracker</Link>
        </div>

        <nav className="hidden md:flex items-center gap-4 lg:gap-8 text-sm">
          {MENU_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className="text-interactive">{item.label}</Link>),
          )}
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          <Suspense fallback={<div className="h-8 w-32 skeleton-loader rounded-lg" />}>
            <AccountsMenu />
          </Suspense>
          <div className="hidden md:block"><ThemeSwitch /></div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
