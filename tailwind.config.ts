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
        purple: "#7239D7",
        darkPurple: "#531fad",
        dark: "#121212",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        title: [
          "92px",
          {
            fontWeight: 700,
            lineHeight: "82px",
          },
        ],
        smallTitle: [
          "52px",
          {
            fontWeight: 700,
            lineHeight: "82px",
          },
        ],
        heading1: [
          "68px",
          {
            fontWeight: 600,
            lineHeight: "82px",
          },
        ],
        heading2: [
          "42px",
          {
            fontWeight: 600,
            lineHeight: "52px",
          },
        ],
        heading3: [
          "36px",
          {
            fontWeight: 600,
            lineHeight: "46px",
          },
        ],
        heading4: [
          "26px",
          {
            fontWeight: 600,
            lineHeight: "36px",
          },
        ],
        heading5: [
          "16px",
          {
            fontWeight: 600,
            lineHeight: "24px",
          },
        ],
        body: [
          "16px",
          {
            fontWeight: 400,
            lineHeight: "24px",
          },
        ],
        smallBody: [
          "12px",
          {
            fontWeight: 400,
            lineHeight: "16px",
          },
        ],
        buttonLink: [
          "14px",
          {
            fontWeight: 600,
            lineHeight: "20px",
          },
        ],
        subtitle: [
          "16px",
          {
            fontWeight: 400,
            lineHeight: "24px",
          },
        ],
        "rate-mini": [
          "16px",
          {
            fontWeight: 400,
            lineHeight: "24px",
          },
        ],
        26: "26px",
      },
    },
  },
  plugins: [],
};
export default config;
