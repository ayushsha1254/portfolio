/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      darkMode: ["class", '[data-mode="dark"]'],
      lightMode: ["class", '[data-mode="light"]'],
      colors: {
        btn: {
          darkNormal: "#ffffff50",
          darkHover: "#ffffff60",
          // darkActive : "#2f2f2f",
          lightNormal: "#0f0f0f60",
          lightHover: "#0f0f0f70",
          // lightActive : "#c6c6c6",
        },
      },
      fontFamily: {
        caveat: ["Caveat Brush", "cursive"],
        mistrydibeti: ["Architects Daughter", "cursive"],
        fatface: ["Abril Fatface", "cursive"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      keyframes: {
        darken: {
          "0%": { backgroundColor: "", opacity: 1 },
          "50%": { backgroundColor: "#000", opacity: 0.5 },
          "100%": { backgroundColor: "", opacity: 1 },
        },
      },
      cursor: {
        pointer: `url('https://aaruush22-bucket.s3.ap-south-1.amazonaws.com/misc/hand-img-fd6a03da.webp'), pointer`,
      },
    },
  },
  plugins: [],
};
