/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: '#1a1a1a',
          secondary: '#333333',
          accent: '#0070f3'
        }
      }
    },
  },
  plugins: [],
}
