/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      "dark": "#000000",
      "light": "#ffffff",
      "dark-1": "#1a1a1a",
      "light-1": "#e6e3b3",
      "third": "#1aba87"
    }
  },
  plugins: [],
}

