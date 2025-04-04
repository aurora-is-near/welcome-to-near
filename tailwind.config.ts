import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xsm: "500px",
      },
      colors: {
        sand: {
          1: "hsl(var(--color-sand-1) / <alpha-value>)",
          2: "hsl(var(--color-sand-2) / <alpha-value>)",
          3: "hsl(var(--color-sand-3) / <alpha-value>)",
          4: "hsl(var(--color-sand-4) / <alpha-value>)",
          5: "hsl(var(--color-sand-5) / <alpha-value>)",
          6: "hsl(var(--color-sand-6) / <alpha-value>)",
          7: "hsl(var(--color-sand-7) / <alpha-value>)",
          8: "hsl(var(--color-sand-8) / <alpha-value>)",
          9: "hsl(var(--color-sand-9) / <alpha-value>)",
          10: "hsl(var(--color-sand-10) / <alpha-value>)",
          11: "hsl(var(--color-sand-11) / <alpha-value>)",
          12: "hsl(var(--color-sand-12) / <alpha-value>)",
        },
        "sand-dark": {
          1: "hsl(var(--color-sand-dark-1) / <alpha-value>)",
          2: "hsl(var(--color-sand-dark-2) / <alpha-value>)",
          3: "hsl(var(--color-sand-dark-3) / <alpha-value>)",
          4: "hsl(var(--color-sand-dark-4) / <alpha-value>)",
          5: "hsl(var(--color-sand-dark-5) / <alpha-value>)",
          6: "hsl(var(--color-sand-dark-6) / <alpha-value>)",
          7: "hsl(var(--color-sand-dark-7) / <alpha-value>)",
          8: "hsl(var(--color-sand-dark-8) / <alpha-value>)",
          9: "hsl(var(--color-sand-dark-9) / <alpha-value>)",
          10: "hsl(var(--color-sand-dark-10) / <alpha-value>)",
          11: "hsl(var(--color-sand-dark-11) / <alpha-value>)",
          12: "hsl(var(--color-sand-dark-12) / <alpha-value>)",
        },
        amber: {
          1: "hsl(var(--color-amber-1) / <alpha-value>)",
          2: "hsl(var(--color-amber-2) / <alpha-value>)",
          3: "hsl(var(--color-amber-3) / <alpha-value>)",
          4: "hsl(var(--color-amber-4) / <alpha-value>)",
          5: "hsl(var(--color-amber-5) / <alpha-value>)",
          6: "hsl(var(--color-amber-6) / <alpha-value>)",
          7: "hsl(var(--color-amber-7) / <alpha-value>)",
          8: "hsl(var(--color-amber-8) / <alpha-value>)",
          9: "hsl(var(--color-amber-9) / <alpha-value>)",
          10: "hsl(var(--color-amber-10) / <alpha-value>)",
          11: "hsl(var(--color-amber-11) / <alpha-value>)",
          12: "hsl(var(--color-amber-12) / <alpha-value>)",
        },
        "amber-dark": {
          1: "hsl(var(--color-amber-dark-1) / <alpha-value>)",
          2: "hsl(var(--color-amber-dark-2) / <alpha-value>)",
          3: "hsl(var(--color-amber-dark-3) / <alpha-value>)",
          4: "hsl(var(--color-amber-dark-4) / <alpha-value>)",
          5: "hsl(var(--color-amber-dark-5) / <alpha-value>)",
          6: "hsl(var(--color-amber-dark-6) / <alpha-value>)",
          7: "hsl(var(--color-amber-dark-7) / <alpha-value>)",
          8: "hsl(var(--color-amber-dark-8) / <alpha-value>)",
          9: "hsl(var(--color-amber-dark-9) / <alpha-value>)",
          10: "hsl(var(--color-amber-dark-10) / <alpha-value>)",
          11: "hsl(var(--color-amber-dark-11) / <alpha-value>)",
          12: "hsl(var(--color-amber-dark-12) / <alpha-value>)",
        },
        green: {
          1: "hsl(var(--color-green-1) / <alpha-value>)",
          2: "hsl(var(--color-green-2) / <alpha-value>)",
          3: "hsl(var(--color-green-3) / <alpha-value>)",
          4: "hsl(var(--color-green-4) / <alpha-value>)",
          5: "hsl(var(--color-green-5) / <alpha-value>)",
          6: "hsl(var(--color-green-6) / <alpha-value>)",
          7: "hsl(var(--color-green-7) / <alpha-value>)",
          8: "hsl(var(--color-green-8) / <alpha-value>)",
          9: "hsl(var(--color-green-9) / <alpha-value>)",
          10: "hsl(var(--color-green-10) / <alpha-value>)",
          11: "hsl(var(--color-green-11) / <alpha-value>)",
          12: "hsl(var(--color-green-12) / <alpha-value>)",
        },
        cyan: {
          1: "hsl(var(--color-cyan-1) / <alpha-value>)",
          2: "hsl(var(--color-cyan-2) / <alpha-value>)",
          3: "hsl(var(--color-cyan-3) / <alpha-value>)",
          4: "hsl(var(--color-cyan-4) / <alpha-value>)",
          5: "hsl(var(--color-cyan-5) / <alpha-value>)",
          6: "hsl(var(--color-cyan-6) / <alpha-value>)",
          7: "hsl(var(--color-cyan-7) / <alpha-value>)",
          8: "hsl(var(--color-cyan-8) / <alpha-value>)",
          9: "hsl(var(--color-cyan-9) / <alpha-value>)",
          10: "hsl(var(--color-cyan-10) / <alpha-value>)",
          11: "hsl(var(--color-cyan-11) / <alpha-value>)",
          12: "hsl(var(--color-cyan-12) / <alpha-value>)",
        },
        violet: {
          1: "hsl(var(--color-violet-1) / <alpha-value>)",
          2: "hsl(var(--color-violet-2) / <alpha-value>)",
          3: "hsl(var(--color-violet-3) / <alpha-value>)",
          4: "hsl(var(--color-violet-4) / <alpha-value>)",
          5: "hsl(var(--color-violet-5) / <alpha-value>)",
          6: "hsl(var(--color-violet-6) / <alpha-value>)",
          7: "hsl(var(--color-violet-7) / <alpha-value>)",
          8: "hsl(var(--color-violet-8) / <alpha-value>)",
          9: "hsl(var(--color-violet-9) / <alpha-value>)",
          10: "hsl(var(--color-violet-10) / <alpha-value>)",
          11: "hsl(var(--color-violet-11) / <alpha-value>)",
          12: "hsl(var(--color-violet-12) / <alpha-value>)",
        },
        red: {
          1: "hsl(var(--color-red-1) / <alpha-value>)",
          2: "hsl(var(--color-red-2) / <alpha-value>)",
          3: "hsl(var(--color-red-3) / <alpha-value>)",
          4: "hsl(var(--color-red-4) / <alpha-value>)",
          5: "hsl(var(--color-red-5) / <alpha-value>)",
          6: "hsl(var(--color-red-6) / <alpha-value>)",
          7: "hsl(var(--color-red-7) / <alpha-value>)",
          8: "hsl(var(--color-red-8) / <alpha-value>)",
          9: "hsl(var(--color-red-9) / <alpha-value>)",
          10: "hsl(var(--color-red-10) / <alpha-value>)",
          11: "hsl(var(--color-red-11) / <alpha-value>)",
          12: "hsl(var(--color-red-12) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-fkGrotesk)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-monaSans)", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        custom: "0 4px 10px rgba(0, 0, 0, 0.05)",
        "custom-lg": "0 4px 15px rgba(0, 0, 0, 0.08)",
      },
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
        "18": "4.5rem",
      },
      letterSpacing: {
        wide: "0.015em",
        wider: "0.02em",
      },
      backgroundImage: {
        "aurora-gradient": "linear-gradient(135deg, #5DEB5A 0%, #FDFC47 100%);",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        ".hide-spinners": {
          "-moz-appearance": "textfield",
          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
          },
        },
        ".hide-scrollbar": {
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};

export default config;
