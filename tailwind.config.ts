import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#7FFF6A',
        'secondary-green': '#4FFFDE',
        'dark-bg': '#0A0F1C',
        'card-bg': '#151B2E',
        'text-light': '#E8F1FF',
        'text-muted': '#8B9CB6',
        'accent-yellow': '#FFD93D',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-green': 'linear-gradient(135deg, #7FFF6A, #4FFFDE)',
      },
      keyframes: {
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 20px rgba(127, 255, 106, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 30px rgba(127, 255, 106, 0.8))' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'slide-down': 'slide-down 0.6s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
