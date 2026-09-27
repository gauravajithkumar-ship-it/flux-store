/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chrysocolla: '#23A9BD',
        midnight: '#010310',
      },
    },
  },
  plugins: [],
}