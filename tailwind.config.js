/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-30px)' },
        },
        'float-shadow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.2' },
          '50%': { transform: 'scale(0.8)', opacity: '0.1' },
        },
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'zero-gravity': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(5px, 10px) rotate(1deg)' },
          '50%': { transform: 'translate(0, -5px) rotate(-1deg)' },
          '75%': { transform: 'translate(-5px, 5px) rotate(0.5deg)' },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-shadow': 'float-shadow 6s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite', /* Note: Used 'gradient' name here */
        'zero-gravity': 'zero-gravity 12s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
