// tailwind.config.js
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['"Fjalla One"', 'system-ui', 'sans-serif'],
                sans: ['system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
