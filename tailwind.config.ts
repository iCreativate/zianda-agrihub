import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#F6F1E8",
          deep: "#EFE8DC"
        },
        paper: "#FFFCF7",
        ink: {
          DEFAULT: "#1C1917",
          muted: "#57534E",
          subtle: "#8A847A"
        },
        stone: {
          DEFAULT: "#E8E0D4",
          strong: "#D4CBBC"
        },
        crop: {
          DEFAULT: "#4F6F56",
          soft: "#E7EFE8"
        },
        clay: {
          DEFAULT: "#C45C3E",
          soft: "#F6E8E2"
        },
        wheat: {
          DEFAULT: "#C9A227",
          soft: "#F7F0DC"
        },
        sky: {
          DEFAULT: "#5B7C99",
          soft: "#E8EEF3"
        },
        brand: {
          DEFAULT: "#4F6F56",
          light: "#E7EFE8",
          dark: "#3D5644"
        }
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 1px 2px rgba(28, 25, 23, 0.04), 0 8px 24px rgba(28, 25, 23, 0.05)",
        lift: "0 2px 4px rgba(28, 25, 23, 0.05), 0 16px 40px rgba(28, 25, 23, 0.08)"
      },
      borderRadius: {
        card: "14px",
        control: "10px"
      },
      letterSpacing: {
        eyebrow: "0.18em"
      }
    }
  },
  plugins: []
};

export default config;
