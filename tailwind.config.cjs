/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './client/index.html',
    './client/**/*.{ts,tsx}',
    './server/**/*.{ts,tsx}',
    './shared/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
