/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: 'rgb(79, 70, 229)',
        secondary: 'rgb(107, 114, 128)',
      },
    },
  },
  plugins: [],
}
