/** @type {import('tailwindcss').Config} */
module.exports = {
  // Keep this tight to avoid scanning node_modules (performance + Metro warnings).
  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
