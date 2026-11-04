/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project pages are served from /<repo-name>/. Override with VITE_BASE if needed.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/Culinary-Learning-Lab/',
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, include: ['tests/**/*.test.ts'] },
});
