/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0E4C4A",
        secondary: "#C9A14A",
        accent: "#C9A14A",
        dark: "#112120",
        light: "#ffffff",
        textPrimary: "#1A1A1A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
