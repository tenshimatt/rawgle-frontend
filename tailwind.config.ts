/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // RAWGLE brand colors - warm palette
        'seasalt': {
          DEFAULT: '#f8f8f8',
          50: '#ffffff',
          100: '#fefefe',
          200: '#fdfdfd',
          300: '#fbfbfb',
          400: '#f9f9f9',
          500: '#f8f8f8',
          600: '#c6c6c6',
          700: '#959595',
          800: '#636363',
          900: '#323232',
        },
        'charcoal': {
          DEFAULT: '#264653',
          50: '#e8edef',
          100: '#c1ced3',
          200: '#9aafb7',
          300: '#738f9b',
          400: '#4c707f',
          500: '#264653',
          600: '#1f3842',
          700: '#182a32',
          800: '#111c21',
          900: '#0a0e11',
        },
        'persian-green': {
          DEFAULT: '#2ba193',
          50: '#eaf8f6',
          100: '#c5ede7',
          200: '#a0e2d8',
          300: '#7bd6c9',
          400: '#56cbba',
          500: '#2ba193',
          600: '#228176',
          700: '#1a6159',
          800: '#11403c',
          900: '#09201f',
        },
        'sandy-brown': {
          DEFAULT: '#f4a261',
          50: '#fef7f1',
          100: '#fce8d6',
          200: '#fad9bb',
          300: '#f8caa0',
          400: '#f6b885',
          500: '#f4a261',
          600: '#c3824e',
          700: '#92613a',
          800: '#614127',
          900: '#312013',
        },
        'burnt-sienna': {
          DEFAULT: '#e76f51',
          50: '#fcf2ef',
          100: '#f7ddd6',
          200: '#f2c8bd',
          300: '#edb3a4',
          400: '#e89e8b',
          500: '#e76f51',
          600: '#b95941',
          700: '#8b4331',
          800: '#5c2c20',
          900: '#2e1610',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "70%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "bounce-in": "bounce-in 0.5s ease-out",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}