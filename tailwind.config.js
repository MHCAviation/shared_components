// tailwind.config.js
module.exports = {
  content: [
    "./components/*.{js,ts,jsx,tsx}",
    "../shared_components/src/*.{js,ts,jsx,tsx}",
    // or if installed via npm (in node_modules)
    "./node_modules/shared_components/dist/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
