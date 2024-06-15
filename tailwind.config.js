/** @type {import('tailwindcss').Config} */

const colors = {
  c0: 'var(--c0)',
  c1: 'var(--c1)',
  c2: 'var(--c2)',
  c3: 'var(--c3)',
  c4: 'var(--c4)',
  c5: 'var(--c5)'
};

module.exports = {
    content: ["./src/**/*.{ejs,js}"],
    theme: {
      extend: {
        colors: colors
      },
    },
    plugins: [],
  }