// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg': '#F7F4EF',           // warm oat paper
        'ink': '#23211F',          // soft charcoal
        'gum-white': '#FFFFFF',
        'charcoal': '#2B2B2B',
        'ghost-green': '#6A766B',  // eucalyptus leaf
        'desert-ochre': '#C6864F', // muted ochre
        'sand': '#E8E1D7',         // section alt background
        'accent': '#8F7B66',       // clay/biscuit accent
        'focus': '#0A84FF'
      },
      fontFamily: {
        'serif': ['Belgiano', 'Georgia', 'serif'],
        'sans': ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      fontSize: {
        'h1': ['56px', { lineHeight: '62px', letterSpacing: '-0.008em', fontWeight: '400' }],
        'h2': ['40px', { lineHeight: '46px', letterSpacing: '-0.008em', fontWeight: '400' }],
        'h3': ['28px', { lineHeight: '34px', letterSpacing: '-0.01em', fontWeight: '400' }],
        'h4': ['22px', { lineHeight: '28px', letterSpacing: '-0.005em', fontWeight: '400' }],
        'body': ['18px', { lineHeight: '28px' }],
        'small': ['15px', { lineHeight: '24px' }]
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '18px'
      },
      boxShadow: {
        'soft': '0 8px 24px rgba(25, 20, 15, 0.06)',
        'card': '0 2px 10px rgba(25, 20, 15, 0.05)'
      },
      maxWidth: {
        'container': '1160px',
        'prose': '66ch'
      },
      spacing: {
        'gutter': '24px'
      },
      animation: {
        'gentle-float': 'gentle-float 6s ease-in-out infinite',
        'micro-zoom': 'micro-zoom 200ms ease-out'
      },
      keyframes: {
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        'micro-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' }
        }
      }
    },
  },
  plugins: [],
};
