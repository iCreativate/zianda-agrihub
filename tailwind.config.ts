import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#16794C",
          light: "#1FA768",
          dark: "#0E5736"
        }
      }
    }
  },
  plugins: []
};

export default config;
