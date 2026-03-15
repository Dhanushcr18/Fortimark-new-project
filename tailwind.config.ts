import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'luxury': {
          'dark': '#050505',
          'charcoal': '#0a0a0a',
          'text': '#FAFAFA',
          'accent': '#ffffff',
        },
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest': '.2em',
        'ultra': '0.5em',
        'extreme': '0.8em',
      },
      boxShadow: {
        'luxury': '0 25px 50px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}

export default config
