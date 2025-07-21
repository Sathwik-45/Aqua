// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // adjust paths based on your project
  ],
  theme: {
    extend: {
      animation: {
        drop: "drop 0.8s ease-out forwards",
        blast: "blast 0.4s ease-out 0.8s forwards",
      },
      keyframes: {
        drop: {
          "0%": { transform: "translateY(-150px) scale(1)", opacity: "0" },
          "100%": { transform: "translateY(120px) scale(1.2)", opacity: "1" },
        },
        blast: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(3)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
