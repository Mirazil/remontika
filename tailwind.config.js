/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
    './src/app/**/*.{ts,tsx,js,jsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C79FF',
        primaryDark: '#1D5CCA',
        text: '#303030'
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif']
      }
    }
  },
  corePlugins: {
    scrollBehavior: true
  },
  plugins: [
  ]
}
