/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B6F47',
        secondary: '#D4A574',
        accent: '#F5DEB3',
        dark: '#3D2914',
        light: '#FFF8F0',
      },
    },
  },
  plugins: [],
}
