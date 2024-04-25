/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      ...colors,
      'mc-red': '#bb231f',
      'mc-green': '#01C601',
      'mc-green-dark': '#018E01',
      'mc-gray': '#404040',
      'coal': '#1F1F1F',
    },
  },
  plugins: [require("tailwindcss-animate")],
};
