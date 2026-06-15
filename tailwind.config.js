/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef4fb',
          100: '#d9e6f6',
          200: '#b3cdee',
          300: '#7fa9e0',
          400: '#4a80cf',
          500: '#2a5fb8',
          600: '#1e4a99',
          700: '#1a3d7c',
          800: '#173261',
          900: '#122548',
          950: '#0b1730'
        },
        sky: {
          400: '#38bdf8',
          500: '#0ea5e9'
        },
        gold: {
          300: '#fcd97d',
          400: '#f6c344',
          500: '#e8ab1c',
          600: '#c98d0e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(18, 37, 72, 0.12)',
        card: '0 8px 32px -8px rgba(18, 37, 72, 0.16)'
      },
      keyframes: {
        'spin-slow': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        dash: {
          to: { 'stroke-dashoffset': '-200' }
        }
      },
      animation: {
        'spin-slow': 'spin-slow 28s linear infinite',
        float: 'float 6s ease-in-out infinite',
        dash: 'dash 8s linear infinite'
      }
    }
  },
  plugins: []
};
