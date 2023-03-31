module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx,hbs,html}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        100: "50rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("tw-elements/dist/plugin")],
};
