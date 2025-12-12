import { vi, beforeEach } from 'vitest';
import { setup as mockSetup } from './mocks/server.js';

beforeEach(() => {
  vi.clearAllMocks();
});

mockSetup();
