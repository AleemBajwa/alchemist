/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neonCyan: '#00ffff',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],      // Logo, headings
        sans: ['Inter Variable', 'sans-serif'],   // Body text
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': {
            boxShadow: '0 0 5px #00ffff88, 0 0 10px #00ffff88',
          },
          '50%': {
            boxShadow: '0 0 20px #00ffffaa, 0 0 30px #00ffffaa',
          },
          '100%': {
            boxShadow: '0 0 5px #00ffff88, 0 0 10px #00ffff88',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
