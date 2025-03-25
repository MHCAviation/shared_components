/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-navy": "#020d81",
        "brand-medium-blue": "#2876fc",
        "brand-blue": "#6EC1E4",
        lineClamp: {
          3: "3",
        },
      },
    },
  },
  plugins: [],
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
};
