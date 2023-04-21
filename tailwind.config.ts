import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",],
  theme: {
    screens: {
      'mobile': '200px',
      ...defaultTheme.screens,
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
