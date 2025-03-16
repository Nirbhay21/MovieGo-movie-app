/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  content: {
    files: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ]
  },
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "Nunito Sans", "League Spartan", "sans-serif"],
      },
    },
  },
  plugins: [],
}
