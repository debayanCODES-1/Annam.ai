import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f5a2d',
        surface: '#f9faf5',
        accent: '#7bb661',
        soil: '#8f614e',
        water: '#5299d3',
        warning: '#f3b33d',
        danger: '#c04b4a',
      },
      boxShadow: {
        card: '0 10px 24px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
