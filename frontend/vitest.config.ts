import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()] as any,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    reporters: [
      'default',
      'junit'
    ],
    outputFile: {
      junit: './coverage/test-results.xml'
    },
    coverage: {
      provider: 'v8',
      reporter: [
        'text',
        'json',
        'html',
        'lcov',
        'text-summary'
      ],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'vitest.setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        'dist/',
        'coverage/',
        '.github/',
      ],
      include: ['src/**/*.{ts,tsx}'],
      all: true,
    }
  },
});