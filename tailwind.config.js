/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // This line enables class-based dark mode
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        "primary": ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
