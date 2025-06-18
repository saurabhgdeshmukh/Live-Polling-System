/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 theme: {
  extend: {
     fontSize: {
        '4.5xl': '2.5rem', // Between 4xl (2.25rem) and 5xl (3rem)
      },
    fontFamily: {
      sora: ['Sora', 'sans-serif'],
    },
  },
}
,
  plugins: [],
};
