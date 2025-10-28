/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./**/*.{js,ts,jsx,tsx}'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: 'class', // <--- AKTIFKAN INI
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'), // Tambahkan ini
  ],
}
