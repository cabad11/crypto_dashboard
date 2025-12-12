import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { test as testBase } from 'vitest';

export const worker = setupWorker(...handlers);

export const it = testBase.extend({
  worker: [
    async ({}, use) => {
      await worker.start();

      await use(worker);
      worker.resetHandlers();

      worker.stop();
    },
    {
      auto: true,
    },
  ],
});
