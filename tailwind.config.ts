import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#BB86FC',
        'bg-gray': '#272727',
        'gray-dark': '#202020',
        'gray-light': '#474646',
        'text-gray': '#D6D4D4',
      },
    },
  },
  plugins: [],
};
export default config;
