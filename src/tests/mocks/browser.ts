import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { test as testBase } from 'vitest';

export const worker = setupWorker(...handlers);

export const test = testBase.extend({
  worker: [
    async ({}, use) => {
      await worker.start({ onUnhandledRequest: 'bypass' });

      await use(worker);
      worker.resetHandlers();

      worker.stop();
    },
    {
      auto: true,
    },
  ],
});
