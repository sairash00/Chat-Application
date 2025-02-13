/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '1k': '1000px',
        '900': '900px',
        '800': '800px',
        '850': '850px',
        '500': '500px',
        '400': '400px',
        '450': '450px',
        '350': '350px',
        '300': '300px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
