/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0e',
        'glass-border': 'rgba(113, 113, 122, 0.5)', // gray-500/50
        'glass-card-bg': 'rgba(255, 255, 255, 0.05)', // white/5
        'glow-blue': 'rgba(0, 180, 255, 0.7)',
      },
      backdropBlur: {
        'lg': '12px',
      },
      boxShadow: {
        'glow': '0 0 15px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [],
}