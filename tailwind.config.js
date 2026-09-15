/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aviation: {
          darkest: '#060D1A',
          dark: '#0B192C',
          navy: '#112240',
          card: '#162C4E',
          cardHover: '#1D3B68',
          border: '#234475',
          borderLight: '#325D9B',
          accent: '#00E5FF',
          accentHover: '#33EBFF',
          cyanGlow: 'rgba(0, 229, 255, 0.15)',
        },
        risk: {
          low: '#10B981',       // Emerald Green (0-30)
          lowBg: 'rgba(16, 185, 129, 0.12)',
          lowBorder: 'rgba(16, 185, 129, 0.3)',
          mod: '#F59E0B',       // Amber (31-60)
          modBg: 'rgba(245, 158, 11, 0.12)',
          modBorder: 'rgba(245, 158, 11, 0.3)',
          high: '#F97316',      // Safety Orange (61-80)
          highBg: 'rgba(249, 115, 22, 0.15)',
          highBorder: 'rgba(249, 115, 22, 0.35)',
          critical: '#EF4444',  // Alert Red (81-100)
          criticalBg: 'rgba(239, 68, 68, 0.15)',
          criticalBorder: 'rgba(239, 68, 68, 0.4)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(0, 229, 255, 0.3)',
        'glow-amber': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.4)',
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'cockpit-card': '0 4px 20px -2px rgba(3, 8, 16, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
