/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBGColor: "#0d1117",
        columnBGColor: "#161c22",
      },
    },
  },
  plugins: [],
};
