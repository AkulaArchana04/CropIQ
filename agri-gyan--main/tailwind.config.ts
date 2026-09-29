import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: 'hsl(var(--primary-light))',
					glow: 'hsl(var(--primary-glow))',
					electric: 'hsl(var(--primary-electric))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					warm: 'hsl(var(--secondary-warm))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					bright: 'hsl(var(--accent-bright))',
					warm: 'hsl(var(--accent-warm))'
				},
				cta: {
					DEFAULT: 'hsl(var(--cta))',
					foreground: 'hsl(var(--cta-foreground))',
					hover: 'hsl(var(--cta-hover))',
					glow: 'hsl(var(--cta-glow))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
					glow: 'hsl(var(--success-glow))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					soft: 'hsl(var(--card-soft))',
					glass: 'hsl(var(--card-glass))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				xl: 'var(--radius-xl)',
				lg: 'var(--radius-lg)',
				DEFAULT: 'var(--radius)',
				md: 'var(--radius)',
				sm: 'var(--radius-sm)'
			},
			fontFamily: {
				sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
				display: ['Satoshi Variable', 'Satoshi', 'sans-serif'],
				body: ['Inter Variable', 'Inter', 'sans-serif'],
				mono: ['JetBrains Mono Variable', 'JetBrains Mono', 'monospace'],
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'card': 'var(--shadow-card)',
				'glow': 'var(--shadow-glow)',
				'electric': 'var(--shadow-electric)',
				'harvest': 'var(--shadow-harvest)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-30px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'magnetic': {
					'0%': { transform: 'scale(1) rotate(0deg)' },
					'25%': { transform: 'scale(1.05) rotate(1deg)' },
					'50%': { transform: 'scale(1.1) rotate(0deg)' },
					'75%': { transform: 'scale(1.05) rotate(-1deg)' },
					'100%': { transform: 'scale(1) rotate(0deg)' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
						transform: 'scale(1)' 
					},
					'50%': { 
						boxShadow: '0 0 40px hsl(var(--primary) / 0.6)',
						transform: 'scale(1.02)' 
					}
				},
				'grow': {
					'0%': { transform: 'scale(0.8) translateY(10px)', opacity: '0' },
					'100%': { transform: 'scale(1) translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
				'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
				'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'magnetic': 'magnetic 2s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'grow': 'grow 0.6s ease-out forwards'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
