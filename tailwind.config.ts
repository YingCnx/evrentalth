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
        // อ้างอิงจากสีเขียวในโลโก้ของคุณ
        brand: {
          DEFAULT: "#A6FF00", 
          dark: "#82C800",
        },
      },
    },
  },
  plugins: [],
};
export default config;