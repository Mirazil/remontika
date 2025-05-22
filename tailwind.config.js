// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
    './src/app/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary     : '#2C79FF',
        primaryDark : '#1D5CCA',
        text        : '#303030',
      },
      keyframes: {
        'fade-in-up': {
          '0%'  : { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)'   },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  corePlugins: { scrollBehavior: true },
  plugins: [],
}
