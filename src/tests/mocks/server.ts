import { beforeAll, afterEach, afterAll } from 'vitest';
import { handlers } from './handlers';
import { setupServer } from 'msw/node';

export const server = setupServer(...handlers);

export const setup = () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};
