/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#9DC88D",
          DEFAULT: "#164A41",
          medium: "#F1B24A",
        },
        secondary: "#4D774E",
      },
    },
  },
  plugins: [],
};
