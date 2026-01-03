/** @type {import('tailwindcss').Config} */
import fluid, { extract, fontSize, screens } from 'fluid-tailwind';
const defaultTheme = require('tailwindcss/defaultTheme');

const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: "selector",
  content: {
    files: ["./src/**/*.{html,njk,js}"],
    extract,
  },
  theme: {
    fontSize: fontSize,
    screens: screens,
    extend: {
      fontFamily: {
        "sans": ["Poppins", defaultTheme.fontFamily.sans],
        "kalam": ["Kalam", defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "7.5xl": ["5.25rem", "5.25rem"]
      },
      colors: {
        primary: {
          DEFAULT: '#D20700',
          50: '#FF8E8B',
          100: '#FF7B76',
          200: '#FF534D',
          300: '#FF2C25',
          400: '#FB0800',
          500: '#D20700',
          600: '#A90600',
          700: '#800400',
          800: '#580300',
          900: '#2F0200',
          950: '#1A0100'
        },
        domu: {
          'DEFAULT': '#030712',
          ...colors.gray
        },
        skola: {
          DEFAULT: '#F58220',
          50: '#FDE4D0',
          100: '#FCDABC',
          200: '#FAC495',
          300: '#F9AE6E',
          400: '#F79847',
          500: '#F58220',
          600: '#E26D0A',
          700: '#BB5B08',
          800: '#944807',
          900: '#6D3505',
          950: '#592B04'
        },
        koralek: {
          DEFAULT: '#FFCB05',
          50: '#FFF1BD',
          100: '#FFEDA8',
          200: '#FFE47F',
          300: '#FFDC57',
          400: '#FFD32E',
          500: '#FFCB05',
          600: '#DBAE00',
          700: '#B28D00',
          800: '#8A6D00',
          900: '#614D00',
          950: '#4C3D00'
        },
        kamarad: {
          DEFAULT: '#A6CE39',
          50: '#E8F2CC',
          100: '#E1EEBC',
          200: '#D2E69B',
          300: '#C3DE7A',
          400: '#B5D65A',
          500: '#A6CE39',
          600: '#8EB22C',
          700: '#749124',
          800: '#5A711C',
          900: '#405014',
          950: '#334010'
        },
        druzina: {
          'DEFAULT': "#ef4444",
          ...colors.red
        },
        jidelna: {
          'DEFAULT': "#9333ea",
          ...colors.purple
        },
        spolecne: {
          'DEFAULT': '#2563EB',
          ...colors.blue
        }
      },
      borderRadius: {
        "4xl": "2rem"
      }
    },
  },
  plugins: [
    fluid,
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
}