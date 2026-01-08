/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          900: '#050b14', // Deep Navy/Black
          800: '#0a1422',
          700: '#112233',
        },
        neon: {
          cyan: '#00f3ff',
          blue: '#0077ff',
          orange: '#ff4800',
          green: '#00ff9d',
          purple: '#bc13fe',
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(5, 11, 20, 0.6)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
        military: ['Rajdhani', 'sans-serif'], // We will need to import this font
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
