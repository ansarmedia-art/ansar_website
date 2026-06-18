/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Hijacking "emerald" classes and replacing with Institutional Deep Blue
        emerald: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#2A5C82',
          700: '#1D4566',
          800: '#13304A',
          900: '#0B2236',
          950: '#0B3C5D', // Trustworthy Deep Blue
        },
        // Hijacking "amber" classes and replacing with Energetic Playful Gold
        amber: {
          50: '#FFF9E6',
          100: '#FFF0C2',
          200: '#FFE08A',
          300: '#FFCE52',
          400: '#FFB81A', // Vibrant Energetic Gold
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
      },
      boxShadow: {
        // Customizing shadows to use a subtle deep-blue ambient tint instead of harsh black
        'sm': '0 2px 8px -2px rgba(11, 60, 93, 0.05)',
        DEFAULT: '0 4px 16px -4px rgba(11, 60, 93, 0.06)',
        'md': '0 8px 24px -4px rgba(11, 60, 93, 0.08)',
        'lg': '0 16px 40px -6px rgba(11, 60, 93, 0.12)',
        'xl': '0 24px 48px -8px rgba(11, 60, 93, 0.18)',
        '2xl': '0 32px 64px -12px rgba(11, 60, 93, 0.22)',
      },
      borderRadius: {
        // Softening the geometry of all existing rounded classes globally
        'lg': '0.75rem',  // 12px
        'xl': '1rem',     // 16px
        '2xl': '1.25rem', // 20px
      }
    },
  },
  plugins: [],
}