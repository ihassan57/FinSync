/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#3B82F6',
        },
        secondary: {
          DEFAULT: '#0EA5E9',
        },
        income: {
          DEFAULT: '#10B981',
        },
        expense: {
          DEFAULT: '#EF4444',
        },
        warning: {
          DEFAULT: '#F59E0B',
        },
        appBg: '#F8FAFC',
        surface: '#FFFFFF',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        borderColor: '#E2E8F0',
        pending: {
          bg: '#FEF3C7',
          text: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        title: ['24px', { lineHeight: '32px', fontWeight: '700' }],
        heading: ['18px', { lineHeight: '28px', fontWeight: '600' }],
        label: ['14px', { lineHeight: '20px', fontWeight: '500' }],
        body: ['13px', { lineHeight: '18px', fontWeight: '400' }],
        caption: ['11px', { lineHeight: '16px', fontWeight: '400' }],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        card: '16px',
      }
    },
  },
  plugins: [],
}
