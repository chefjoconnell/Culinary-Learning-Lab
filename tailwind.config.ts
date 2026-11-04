import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: { 900: '#14161a', 800: '#1d2026', 700: '#2a2e36', 600: '#3a3f49' },
        warm: { 50: '#fbf8f3', 100: '#f4efe6', 200: '#e8e0d2' },
        steel: { 300: '#c3c8cf', 400: '#9aa1ab', 500: '#6b7380', 600: '#4d5461' },
        ember: { 500: '#c2410c', 600: '#9a3412', 400: '#fb923c' },
        herb: { 500: '#3f7d4e', 600: '#2f6a3e', 400: '#6fbf84' },
        saffron: { 400: '#f2b84b', 500: '#d99a1e' },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
