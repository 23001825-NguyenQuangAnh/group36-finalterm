/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // để Tailwind quét class trong code React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
