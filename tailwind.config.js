/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'g-bg':      '#0b0d11',
        'g-nav':     '#10131a',
        'g-card':    '#13161f',
        'g-accent':  '#6c63ff',
        'g-hot':     '#ff4757',
        'g-green':   '#2ed573',
        'g-muted':   '#5a5f74',
        'g-text':    '#dde1f0',
        'g-sub':     '#8b90a8',
        'g-border':  'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        dm:       ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
