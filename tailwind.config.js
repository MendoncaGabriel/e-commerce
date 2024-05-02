/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/**/*.{ejs,js}"],
  theme: {
    extend: {
      colors:{
        avisoG1: '#FF0000',
        avisoG2: '#FF0000',
        newsletter: "#EC4899",
        sigaNoInstagram:"#FFFFFF",
        footer: "#FFF212"
      }
    },
  },
  plugins: [],
}