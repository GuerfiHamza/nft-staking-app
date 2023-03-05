/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'purple1' : "#400077",
      'purple2' : "#aa66ff",
      'pink1' : "#EEAFFF",
      'blue1' : "#AAEFFF",
      'blue2' : "#30307A",
      'blue3' : "#171124",
      'grey1' : "#6F617A",
      'white' : "#fff",
      'darkblue' : "#334477",

    },
  },
}