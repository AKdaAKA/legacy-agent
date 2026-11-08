/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', '"Courier New"', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        mainframe: {
          bg: '#0a0d14',
          card: '#121824',
          border: '#1f293d',
          green: '#10b981',
          amber: '#f59e0b',
          glow: '#059669',
        }
      }
    },
  },
  plugins: [],
}

