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
// tailwind.config.js
module.exports = {
  safelist: [
    'bg-red-50', 'bg-purple-50', 'bg-blue-50', 'bg-orange-50', 'bg-green-50', 'bg-indigo-50', 'bg-yellow-50',
    'border-red-300', 'border-purple-300', 'border-blue-300', 'border-orange-300', 'border-green-300', 'border-indigo-300', 'border-yellow-300',
    'bg-red-200', 'bg-purple-200', 'bg-blue-200', 'bg-orange-200', 'bg-green-200', 'bg-indigo-200', 'bg-yellow-200',
    'text-red-800', 'text-purple-800', 'text-blue-800', 'text-orange-800', 'text-green-800', 'text-indigo-800', 'text-yellow-800',
  ],
};
