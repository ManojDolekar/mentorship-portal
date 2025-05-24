/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx,vue}",
    ],
    theme: {
      extend: {
        keyframes: {
          wiggle: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideIn: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(0)' },
          }
        },
        animation: {
          wiggle: 'wiggle 1s ease-in-out infinite',
          fadeIn: 'fadeIn 1s ease-in',
          slideIn: 'slideIn 0.5s ease-out'
        }
      },
    },
    plugins: [],
  }