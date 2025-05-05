/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Dark theme colors similar to Claude's desktop app
                background: "#0C0E12",
                surface: "#1A1D24",
                border: "#2A2E38",
                primary: "#6E56CF",
                "primary-hover": "#7B61E8",
                text: {
                    DEFAULT: "#E2E4E9",
                    secondary: "#9DA3B3",
                },
            },
        },
    },
    plugins: [],
};
