/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                fadeInUp: {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: 0, transform: 'translateX(-50px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: 0, transform: 'translateX(50px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: 0, transform: 'scale(0.9)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                bounce: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.3s ease-out",
                fadeInUp: 'fadeInUp 0.8s ease-out forwards',
                slideInLeft: 'slideInLeft 0.8s ease-out forwards',
                slideInRight: 'slideInRight 0.8s ease-out forwards',
                scaleIn: 'scaleIn 0.5s ease-out forwards',
                shimmer: 'shimmer 2s infinite linear',
                bounce: 'bounce 2s infinite',
            },
        },
    },
    plugins: [],
};
