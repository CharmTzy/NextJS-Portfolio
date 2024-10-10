/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'var(--bg-color)',
      },
      animation: {
        'text-gradient': 'textShift 1.5s ease-in-out infinite', // Increased time and changed keyframe name
      },
      keyframes: {
        textShift: {
          '0%': { backgroundPosition: '0% center' }, // Start from left
          '50%': { backgroundPosition: '100% center' }, // Move to right
          '100%': { backgroundPosition: '0% center' }, // Move back to left
        },
      },
    },
  },
  plugins: [],
};
