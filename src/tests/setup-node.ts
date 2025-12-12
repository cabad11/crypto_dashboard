import { afterEach, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setup as mockSetup } from './mocks/server.js';

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
});

mockSetup();
