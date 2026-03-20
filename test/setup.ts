import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
global.localStorage = localStorageMock as unknown as Storage

// Mock VITE_API_URL
// @ts-expect-error - Mocking import.meta.env for testing
import.meta.env = {
  VITE_API_URL: 'http://localhost:5000'
}
