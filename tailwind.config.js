/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#1a1a2e',
          200: '#16213e',
          300: '#0f0f1a',
        },
        accent: {
          100: '#4ecca3',
          200: '#3db892',
        },
      },
    },
  },
  plugins: [],
}
