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
    animation: {
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(50%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
  },
}
,
  plugins: [],
};
