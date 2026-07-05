import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18201f",
        mist: "#f5f7f6",
        leaf: "#2f6f5e",
        coral: "#c4513b",
        gold: "#c7952f"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 32, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
