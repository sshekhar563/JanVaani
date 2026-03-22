/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Oil Painting Palette (Original)
        primary: {
          DEFAULT: '#C4440A',
          dark: '#a3370a',
          light: '#d65c28',
        },
        fire: {
          DEFAULT: '#D42E18',
        },
        amber: {
          DEFAULT: '#E8820A',
          light: '#f09a2e',
        },
        gold: {
          DEFAULT: '#F5B830',
          light: '#f7c94e',
        },
        teal: {
          DEFAULT: '#1A7A8A',
          deep: '#0D4A5C',
          light: '#2A9BAD',
        },
        cyan: {
          DEFAULT: '#2A9BAD',
        },
        cream: {
          DEFAULT: '#FDECC8',
          dark: '#f5daa5',
        },
        ink: {
          DEFAULT: '#1A1208',
          soft: '#3D2A18',
        },
        success: {
          DEFAULT: '#047857',
          light: '#06B07E',
          50: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          50: '#FFFBEB',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#EF4444',
          50: '#FEF2F2',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        devanagari: ['Noto Serif Devanagari', 'serif'],
        body: ['Hind Siliguri', 'system-ui', 'sans-serif'],
        sans: ['Hind Siliguri', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'recording-pulse': 'recordingPulse 1.5s ease-in-out infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite',
        'diya-glow': 'diyaGlow 2s ease-in-out infinite',
        'stamp': 'stamp 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        recordingPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 46, 24, 0.4)', transform: 'scale(1)' },
          '50%': { boxShadow: '0 0 0 20px rgba(212, 46, 24, 0)', transform: 'scale(1.05)' },
        },
        waveform: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '32px' },
        },
        diyaGlow: {
          '0%, 100%': { boxShadow: '0 0 12px 2px rgba(232,130,10,0.3)' },
          '50%': { boxShadow: '0 0 28px 8px rgba(232,130,10,0.55)' },
        },
        stamp: {
          '0%': { opacity: '0', transform: 'scale(2) rotate(-15deg)' },
          '60%': { opacity: '1', transform: 'scale(0.95) rotate(2deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
      },
      boxShadow: {
        'heritage': '0 4px 24px -4px rgba(196,68,10,0.18)',
        'amber-glow': '0 0 24px rgba(232,130,10,0.35)',
        'warm': '0 8px 32px -8px rgba(26,18,8,0.15)',
        'card': '0 2px 16px rgba(196,68,10,0.08)',
        'card-hover': '0 12px 40px rgba(196,68,10,0.18)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
