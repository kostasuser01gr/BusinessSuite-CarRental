import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock: any = {
  getItem: vi.fn((key: string) => localStorageMock[key] || null),
  setItem: vi.fn((key: string, value: string) => { localStorageMock[key] = value }),
  removeItem: vi.fn((key: string) => { delete localStorageMock[key] }),
  clear: vi.fn(() => { 
    Object.keys(localStorageMock).forEach(key => { 
      if (typeof localStorageMock[key] !== 'function') delete localStorageMock[key] 
    }) 
  }),
  length: 0,
  key: vi.fn(),
}
global.localStorage = localStorageMock as unknown as Storage

// Mock SVG getTotalLength (not available in JSDOM)
if (global.SVGElement && !((global.SVGElement.prototype as any).getTotalLength)) {
  (global.SVGElement.prototype as any).getTotalLength = () => 100;
}

// Mock AudioContext (not available in JSDOM)
global.AudioContext = vi.fn().mockImplementation(() => ({
  resume: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  createOscillator: vi.fn().mockReturnValue({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
  }),
  createGain: vi.fn().mockReturnValue({
    connect: vi.fn(),
    gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
  }),
  destination: {},
  currentTime: 0,
  state: 'running'
})) as any;

// Mock VITE_API_URL
// @ts-expect-error - Mocking import.meta.env for testing
import.meta.env = {
  VITE_API_URL: 'http://localhost:5000'
}
