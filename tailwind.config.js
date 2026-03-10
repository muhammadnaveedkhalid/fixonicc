/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e6e8eb',
          100: '#cdcfd6',
          200: '#9ba0ad',
          300: '#697084',
          400: '#37415b',
          500: '#0A192F', // Deep Navy Primary
          600: '#09162a',
          700: '#07111f',
          800: '#050b15',
          900: '#02060a',
          950: '#010305',
        },
        lime: {
          50: '#f5ffea',
          100: '#ebffd5',
          200: '#d7ffab',
          300: '#c3ff81',
          400: '#afff57',
          500: '#99FF00', // Vibrant Lime CTA
          600: '#7acc00',
          700: '#5c9900',
          800: '#3d6600',
          900: '#1f3300',
          950: '#0f1a00',
        },
        primary: {
          DEFAULT: '#0A192F',
        },
        secondary: {
          DEFAULT: '#99FF00',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

