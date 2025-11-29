/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    fontFamily: {
      sans: [],
      serif: [],
      mono: ['monospace'],
    },
    extend: {
      colors: {

      },
      spacing: Object.fromEntries(
        Array.from({ length: 200 }, (_, i) => [`${i}`, `${i}px`]),
      ),
      containers: {
        '2xl': '1280px',
        'xl': '1280px',
        'lg': '1024px',
        'md': '768px',
        'sm': '640px',
        'xs': '375px',
        'vs': '320px',
      },
      boxShadow: {
        'text-shadow': 'var(--tg-text-shadow)',
        'tg-shadow-inset-dialog': 'var(--tg-shadow-inset-dialog)',
        'tg-box-shadow': 'var(--tg-box-shadow)',
        'tg-box-shadow-lg': 'var(--tg-box-shadow-lg)',
        'tg-box-shadow-banner': 'var(--tg-shadow-banner)',
        'tg-header-shadow': 'var(--tg-header-shadow)',
      },
      dropShadow: {
        'text-shadow-white': '0 1px 0 #fff',
      },
    },
    screens: {
      vs: '320px',
      xs: '375px',
      xm: '601px',
      md: '768px',
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-lg': {
          textShadow: 'var(--tg-text-shadow-lg)',
        },
      }
      addUtilities(newUtilities, ['responsive'])
    },
  ],
}
