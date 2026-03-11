/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        "primary-dark": "#E05A5A",
        secondary: "#E0F7FA",
        "accent-mango": "#FF9F1C",
        "accent-strawberry": "#FF4D4D",
        "text-chocolate": "#2D1B0E",
        "background-light": "#FFFEF5",
        "background-dark": "#1f1513",
      },
      fontFamily: {
        display: ["Titan One", "cursive"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        product: ["Fredoka", "sans-serif"],
        hand: ["Permanent Marker", "cursive"],
      },
      backgroundImage: {
        grain: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E')",
      },
      rotate: {
        "1": "1deg",
        "2": "2deg",
        "3": "3deg",
        "-1": "-1deg",
        "-2": "-2deg",
        "-3": "-3deg",
      },
      boxShadow: {
        sticker: "6px 6px 0px 0px #2D1B0E",
        "sticker-sm": "4px 4px 0px 0px #2D1B0E",
        "sticker-lg": "12px 12px 0px 0px #2D1B0E",
        chunky: "4px 4px 0px 0px #2D1B0E",
        "chunky-sm": "2px 2px 0px 0px #2D1B0E",
        "chunky-lg": "6px 6px 0px 0px #2D1B0E",
        polaroid: "10px 10px 0px 0px rgba(45, 27, 14, 0.9)",
      },
    },
  },
  plugins: [],
};
