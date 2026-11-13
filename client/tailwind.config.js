/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        liquidity: {
          // Two complementary theme colors: navy (cool) + gold (warm).
          secondary: "#1B3358",
          accent: "#D9A441",
          neutral: "#1B3358",
          // Strong third color, reserved for CTAs (btn-primary).
          primary: "#E63972",
          "base-100": "#FFFFFF",
          "base-200": "#F3F4F6",
          "base-300": "#E5E7EB",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "9999px",
        },
      },
    ],
  },
};
