/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-display)', 'serif'],
      },

      colors: {
        // Existing shadcn tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // NEW VedaAI Tokens
        surface: '#FFFFFF',

        borderSoft: '#ECEEF2',

        textPrimary: '#111827',

        textSecondary: '#6B7280',

        success: '#10B981',

        warning: '#F59E0B',

        danger: '#EF4444',

        violet: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',

        // NEW
        xl2: '20px',
        xl3: '28px',
        xl4: '32px',
      },

      boxShadow: {
        // NEW
        card: '0 10px 30px rgba(0,0,0,0.04)',

        sidebar: '0 10px 25px rgba(0,0,0,0.05)',

        soft: '0 4px 20px rgba(0,0,0,0.06)',

        floating: '0 12px 40px rgba(124,58,237,0.18)',
      },

      backdropBlur: {
        xs: '2px',
      },

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
      },

      maxWidth: {
        dashboard: '1600px',
      },

      gridTemplateColumns: {
        dashboard: '280px minmax(0,1fr)',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },

        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: { height: '0' },
        },

        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },

        'fade-in': {
          from: {
            opacity: '0',
            transform: 'translateY(8px)',
          },

          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        'slide-in': {
          from: {
            opacity: '0',
            transform: 'translateX(-12px)',
          },

          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },

        // NEW
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },

          '50%': {
            transform: 'translateY(-4px)',
          },
        },

        pulseSoft: {
          '0%, 100%': {
            opacity: '1',
          },

          '50%': {
            opacity: '.7',
          },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',

        'accordion-up': 'accordion-up 0.2s ease-out',

        shimmer: 'shimmer 2s infinite',

        'fade-in': 'fade-in 0.4s ease-out forwards',

        'slide-in': 'slide-in 0.3s ease-out forwards',

        // NEW
        float: 'float 4s ease-in-out infinite',

        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
      },
    },
  },

  plugins: [require('tailwindcss-animate')],
};