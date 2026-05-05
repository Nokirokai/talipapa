/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Sora', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        talipapa: {
          primary: '#F59E0B',
          accent: '#0D9488',
          warning: '#EF4444',
          highlight: '#FBBF24',
          white: '#FFF8F0',
          dark: '#0F172A',
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        clay: '6px 6px 12px rgba(0,0,0,0.25), -2px -2px 8px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
        'clay-pressed': '2px 2px 6px rgba(0,0,0,0.3), inset 2px 2px 6px rgba(0,0,0,0.2)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
