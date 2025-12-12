import { afterEach, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import './mocks/browser.js';

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.clearAllMocks();
});
