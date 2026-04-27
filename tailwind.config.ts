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
        petrol: {
          DEFAULT: "#0a1628",
          50: "#122a45",
          100: "#0f2138",
          200: "#0c1a2e",
          300: "#0a1628",
        },
        graphite: "#0d1117",
        ink: "#e8edf4",
        muted: "#94a3b8",
        accent: {
          DEFAULT: "#c9a962",
          soft: "#d4b87a",
          dark: "#9a7b3c",
        },
        copper: {
          DEFAULT: "#b87333",
          light: "#c98a4d",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(201,169,98,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,169,98,0.06) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,169,98,0.12), transparent)",
      },
    },
  },
  plugins: [],
};
export default config;
