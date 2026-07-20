/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF2F2',
          100: '#FDE8E8',
          200: '#FBD5D5',
          300: '#F8B4B4',
          400: '#F98080',
          500: '#E63946', // Vibrant energetic vermilion red
          600: '#D62828', // Deep brand red
          700: '#9B1C1C',
          800: '#771D1D',
          900: '#450A0A',
        },
        saffron: {
          400: '#FFB703',
          500: '#F77F00', // Energetic turmeric orange
          600: '#E85D04',
        },
        fresh: {
          500: '#10B981', // Emerald veg indicator
          600: '#059669',
        },
        ink: {
          800: '#1E293B',
          900: '#0F172A', // Deep rich charcoal heading
        },
        cream: {
          50: '#FFFDF9',
          100: '#FAF7F2',
          200: '#F3EDE2',
        },
        admin: {
          // Deep dark mode scale for admin UI
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617', // Ultimate dark background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 10px 30px -10px rgba(230, 57, 70, 0.3)',
        'glow-orange': '0 10px 30px -10px rgba(247, 127, 0, 0.35)',
        'card-elevated': '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
        'dark-elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'dark-floating': '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
      }
    },
  },
  plugins: [],
}
