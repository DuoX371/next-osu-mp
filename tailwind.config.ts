import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                display: ['Playfair Display', 'serif'],
                mono: ['DM Mono', 'monospace'],
                sans: ['DM Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;