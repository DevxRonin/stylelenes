/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0A0A0A',
          dark: '#121212',
          card: '#181818',
          border: 'rgba(201, 162, 39, 0.2)',
          gold: '#C9A227',
          goldLight: '#E5BF45',
          goldDark: '#9F7C14',
          white: '#FFFFFF',
          gray: '#F5F5F5',
          muted: '#A3A3A3',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '22px',
      },
      boxShadow: {
        'luxury': '0 20px 40px rgba(0, 0, 0, 0.12)',
        'luxury-hover': '0 25px 50px rgba(201, 162, 39, 0.15)',
        'gold-glow': '0 0 25px rgba(201, 162, 39, 0.35)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #DFB83E 0%, #C9A227 50%, #9F7C14 100%)',
        'hero-gradient': 'radial-gradient(ellipse at top, #1a1712 0%, #0A0A0A 80%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
    },
  },
  plugins: [],
};
