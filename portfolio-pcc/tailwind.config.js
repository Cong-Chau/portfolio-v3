/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // tuỳ theo cấu trúc project
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@midudev/tailwind-animations")],
};
