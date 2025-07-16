module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)', // blue-600
          light: 'var(--color-primary-light)', // blue-500
          dark: 'var(--color-primary-dark)', // blue-700
        },
        success: 'var(--color-success)', // green-600
        warning: 'var(--color-warning)', // amber-500
        error: 'var(--color-error)', // red-600
        info: 'var(--color-info)', // sky-500
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          500: 'var(--color-gray-500)',
          700: 'var(--color-gray-700)',
          900: 'var(--color-gray-900)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'pulse-custom': 'pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    require('@tailwindcss/aspect-ratio'),
  ],
}