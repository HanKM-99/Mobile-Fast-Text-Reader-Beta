import typography from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { surface:'#0B1220', surfaceLight:'#F8FAFC', cardLight:'#FFFFFF' },
      boxShadow: { soft:'0 6px 24px rgba(0,0,0,.18)' }
    }
  },
  plugins: [typography()]
}
