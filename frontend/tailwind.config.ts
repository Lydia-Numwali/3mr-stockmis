import type { Config } from "tailwindcss";
export default {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle: "wiggle 1.5s infinite",
      },  
      backgroundImage: {
        "auth-pattern": "url('/images/auth/auth_background_pattern.png')",
      },
      colors: {
        // blue: "#001526",
        blue:"#083c6c",
        "primary-blue": "#083c6c",
        "primary-blue-light": "#4B6B89",
        "primary-light": "#C7D7FF",
        "secondary-white": "#FAFAFA",
        "dark-navy": "#081129",
        "dark-navy-light": "#4D4D4D",
        "gray-primary": "#616266",
        "gray-secondary": "#F4F6F8",
        gray: "#181D27",
        "secondary-gray": "#535862",
        "light-gray": "#F9F5FF",
        "border-color": "#E9EAEB",
        "text-light": "#717680",
        success: "#17B26A",
        "secondary-blue":"#083c6c"
      },
      boxShadow: {
        "inner-custom": "inset 0px 0px 19.3px 5px rgba(255, 255, 255, 0.25)",
        "inner-custom-dark":
          "inset 1.37px 5.48px 21.4px 0px rgba(29, 29, 29, 0.1)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
