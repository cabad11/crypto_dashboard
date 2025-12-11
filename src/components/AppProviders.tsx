'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/utils/web3/wagmiConfig.ts';
import PopupContext from '@/contexts/PopupContext';
import ThemeContext from '@/contexts/ThemeContext';

const queryClient = new QueryClient();

const AppProviders = ({ children }: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PopupContext>
          <ThemeContext>
            {children}
          </ThemeContext>
        </PopupContext>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default AppProviders;
