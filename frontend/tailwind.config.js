/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // backgroundImage: {
      //   'custom-gradient': 'linear-gradient(171deg, rgba(3,47,48,1) 0%, rgba(10,112,117,1) 100%)',
      // },
    },
    // colors: {
    //   "dark": "#032f30",
    //   "light": "#ffffff",
    //   "dark-1": "#1a1a1a",
    //   "light-1": "#e6e3b3",
    //   "third": "#1aba87",
    //   "edit": "blue",
    //   "delete": "#FF0000",
    //   "completed": "#00FF00"
    // }
  },
  plugins: [],
}

