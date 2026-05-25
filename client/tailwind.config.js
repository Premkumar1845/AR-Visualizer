/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                ink: {
                    950: '#070708',
                    900: '#0F1115',
                    800: '#15171C',
                    700: '#1B1E25',
                },
                accent: {
                    DEFAULT: '#7b61ff',
                    soft: '#8ea7ff',
                    glow: '#a48dff',
                },
                text: {
                    primary: '#F5F7FA',
                    muted: '#A8B0BD',
                    dim: '#6B7280',
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
                manrope: ['Manrope', 'Inter', 'sans-serif'],
                cabin: ['Cabin', 'Inter', 'sans-serif'],
                editorial: ['"Instrument Serif"', 'Georgia', 'serif'],
            },
            backgroundImage: {
                'mesh-accent':
                    'radial-gradient(ellipse at top, rgba(123,97,255,0.22), transparent 55%), radial-gradient(ellipse at bottom right, rgba(142,167,255,0.14), transparent 60%)',
                'grid-soft':
                    'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            },
            backgroundSize: {
                'grid-soft': '44px 44px',
            },
            boxShadow: {
                glass: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 8px 30px rgba(0,0,0,0.45)',
                glow: '0 0 0 1px rgba(123,97,255,0.35), 0 12px 40px rgba(123,97,255,0.25)',
                spatial: '0 30px 80px -20px rgba(123,97,255,0.35), 0 8px 30px rgba(0,0,0,0.55)',
            },
            keyframes: {
                float: {
                    '0%,100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'pulse-soft': {
                    '0%,100%': { opacity: '0.55' },
                    '50%': { opacity: '1' },
                },
            },
            animation: {
                float: 'float 6s ease-in-out infinite',
                shimmer: 'shimmer 3.5s linear infinite',
                'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
