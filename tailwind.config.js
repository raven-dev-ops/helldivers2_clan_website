// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color set
        brand: {
          DEFAULT: "#00bcd4",   // brand
          hover: "#0097a7",    // hover shade
          bg: "#1a1a2e",       // background color
          "bg-alt": "#282842", // secondary background (gradient end or accent)
        },
        // If you want near-white text color, you can unify that here too:
        "brand-text": "#e0e0e0",
      },
      backgroundImage: {
        // An optional hero gradient if you want to reuse it:
        "hero-gradient": "linear-gradient(to bottom, #1a1a2e, #282842)",
      },
      // Example for custom fonts if desired:
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        // or your other chosen fonts like Orbitron or Audiowide, etc.
      },
      // If you want to define custom boxShadows or glows:
      boxShadow: {
        "neon-cyan": "0 0 15px rgba(0, 188, 212, 0.6)",   // a neon glow matching #00bcd4
        "neon-hover": "0 0 20px rgba(0, 151, 167, 0.8)", // a brighter hover glow
      },
    },
  },
  // If you’d like to style markdown or dynamic text with Tailwind’s Typography plugin:
  plugins: [
    // require('@tailwindcss/typography'),
  ],
};
