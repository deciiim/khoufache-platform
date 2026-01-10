/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // <--- This covers subfolders like pages/components
    "./src/pages/**/*.{js,ts,jsx,tsx}", // Add this just to be safe
    "./src/components/**/*.{js,ts,jsx,tsx}", // Add this just to be safe
  ],
  theme: {
    extend: {
      colors: {
        batBlack: '#050505',
        batYellow: '#FFE81F',
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}