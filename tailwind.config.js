/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2d5016',
        secondary: '#48a868',
         border: '#e2e8f0',
      },
    },
  },
  plugins: [],
};
