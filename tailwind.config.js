/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FC6E05", // Oranye utama
        dark: "#120701",    // Hitam untuk teks
        accent: "#FFB800",  // Kuning
        light: "#FEF2E5",   // Oranye sangat muda (background)
        graybg: "#ECF0F3",  // Abu-abu background halaman
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}