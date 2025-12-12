import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { playwright } from '@vitest/browser-playwright';

import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          include: ['src/components/**/__tests__/*.test.tsx', 'src/hooks/**/__tests__/*.test.tsx'],
          name: 'browser',
          setupFiles: './src/tests/setup-browser.ts',
          browser: {
            enabled: true,
            screenshotFailures: false,
            instances: [
              { browser: 'chromium' },
            ],
            headless: true,
            provider: playwright(),
          },
        },
      },
      {
        extends: true,
        test: {
          setupFiles: './src/tests/setup-node.ts',
          include: ['src/app/api/**/__tests__/*.test.ts'],
          name: 'unit',
          environment: 'node',
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules', 'src/tests'],
    },
  },
  define: {
    'process.env': JSON.stringify({}),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
