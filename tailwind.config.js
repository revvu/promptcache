/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f5efe3',
        ink: '#181512',
        graphite: '#2d2722',
        parchment: '#fbf5ea',
        ember: '#df5c3f',
        teal: '#0f766e',
        line: 'rgba(24, 21, 18, 0.12)'
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        body: ['Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      boxShadow: {
        panel: '0 20px 60px rgba(24, 21, 18, 0.08)',
        float: '0 12px 30px rgba(24, 21, 18, 0.12)'
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at top left, rgba(223, 92, 63, 0.24), transparent 35%), radial-gradient(circle at bottom right, rgba(15, 118, 110, 0.18), transparent 32%)'
      }
    }
  },
  plugins: []
};
