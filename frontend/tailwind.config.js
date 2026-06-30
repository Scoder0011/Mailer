/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#2563eb',
          dark: '#3b82f6',
          bgDark: '#0f172a',
          cardDark: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}