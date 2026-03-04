export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,css}"
    ],
    theme: {
        extend: {
            colors: {
                'primary-teal': '#4fb3ad',
                'soft-peach': '#ffdbc5',
                'pastel-yellow': '#fef9c3',
                'washi-pink': '#fca5a5',
                'washi-blue': '#93c5fd',
                'washi-green': '#86efac',
                'ink-blue': '#1e293b'
            },
            fontFamily: {
                'bubbly': ['Fredoka', 'sans-serif'],
                'handwritten': ['Indie Flower', 'cursive'],
                'script': ['Patrick Hand', 'cursive']
            },
            borderRadius: {
                DEFAULT: '0.5rem',
                lg: '1rem',
                xl: '1.5rem',
                full: '9999px'
            }
        }
    },
    plugins: []
}