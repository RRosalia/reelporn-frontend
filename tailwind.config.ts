import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#c2338a",
          dark: "#9b2a6e",
        },
        secondary: {
          DEFAULT: "#f8c537",
          dark: "#d9a81f",
        },
        dark: {
          DEFAULT: "#1a1626",
          secondary: "#2b2838",
        },
      },
    },
  },
  plugins: [],
};

export default config;
