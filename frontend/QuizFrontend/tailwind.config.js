module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6F61', // Vibrant coral for headers
        secondary: '#6B7280', // Slate gray for backgrounds
        accent: '#FFD700', // Gold for highlights
        success: '#10B981', // Emerald green for correct answers
        error: '#EF4444', // Red for warnings
        background: '#F3F4F6' // Light gray background
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: []
};