/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
  colors: {
    primary: "#4F46E5",
    secondary: "#0EA5E9",
    background: "#FFFFFF",
    surface: "#F3F4F6",
    text: "#1F2937",
    border: "#D1D5DB",
    error: "#F43F5E",
  },
},
  },
  plugins: [],
};
