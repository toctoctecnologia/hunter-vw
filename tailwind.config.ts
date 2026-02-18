
import type { Config } from "tailwindcss";

export default {
        darkMode: ["class", "[data-theme='dark']"],
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
                        screens: {
                                xs: '480px',
                        },
                        colors: {
                                border: 'hsl(var(--border))',
                                input: 'hsl(var(--inputBorder))',
                                ring: 'hsl(var(--focusRing))',
                                background: 'hsl(var(--background))',
                                foreground: 'hsl(var(--text))',
                                surface: 'hsl(var(--surface))',
                                surface2: 'hsl(var(--surface2))',
                                surface3: 'hsl(var(--surface3))',
                                textPrimary: 'hsl(var(--textPrimary))',
                                textSecondary: 'hsl(var(--textSecondary))',
                                textMuted: 'hsl(var(--textMuted))',
                                textDisabled: 'hsl(var(--textDisabled))',
                                bgPage: 'hsl(var(--bgPage))',
                                bgCard: 'hsl(var(--bgCard))',
                                bgSubtle: 'hsl(var(--bgSubtle))',
                                borderSubtle: 'hsl(var(--borderSubtle))',
                                info: 'hsl(var(--info))',
                                successToken: 'hsl(var(--success))',
                                dangerToken: 'hsl(var(--danger))',
                                warningToken: 'hsl(var(--warning))',
                                primary: {
                                        DEFAULT: 'hsl(var(--brandPrimary))',
                                        foreground: 'hsl(var(--brandPrimaryText))'
                                },
                                secondary: {
                                        DEFAULT: 'hsl(var(--surface3))',
                                        foreground: 'hsl(var(--text))'
                                },
                                destructive: {
                                        DEFAULT: 'hsl(var(--danger))',
                                        foreground: 'hsl(var(--danger-foreground))'
                                },
                                danger: {
                                        DEFAULT: 'hsl(var(--danger))',
                                        foreground: 'hsl(var(--danger-foreground))'
                                },
                                success: {
                                        DEFAULT: 'hsl(var(--success))',
                                        foreground: 'hsl(var(--text))'
                                },
                                warning: {
                                        DEFAULT: 'hsl(var(--warning))',
                                        foreground: 'hsl(var(--text))'
                                },
                                muted: {
                                        DEFAULT: 'hsl(var(--surface3))',
                                        foreground: 'hsl(var(--textMuted))'
                                },
                                accent: {
                                        DEFAULT: 'hsl(var(--accent))',
                                        foreground: 'hsl(var(--text))'
                                },
                                popover: {
                                        DEFAULT: 'hsl(var(--surface2))',
                                        foreground: 'hsl(var(--text))'
                                },
                                card: {
                                        DEFAULT: 'hsl(var(--surface2))',
                                        foreground: 'hsl(var(--text))'
                                },
                                sidebar: {
                                        DEFAULT: 'hsl(var(--surface))',
                                        foreground: 'hsl(var(--text))',
                                        primary: 'hsl(var(--brandPrimary))',
                                        'primary-foreground': 'hsl(var(--brandPrimaryText))',
                                        accent: 'hsl(var(--surface2))',
                                        'accent-foreground': 'hsl(var(--text))',
                                        border: 'hsl(var(--border))',
                                        ring: 'hsl(var(--focusRing))'
                                },
                                orange: {
                                        50: 'hsl(var(--accent) / 0.08)',
                                        100: 'hsl(var(--accent) / 0.12)',
					200: 'hsl(var(--accent) / 0.2)',
					300: 'hsl(var(--accent) / 0.35)',
					400: 'hsl(var(--accent) / 0.6)',
					500: 'hsl(var(--accent))',
					600: 'hsl(var(--accentHover))',
					700: 'hsl(var(--accentHover))',
					800: 'hsl(var(--accentHover))',
					900: 'hsl(var(--accentHover))',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			spacing: {
				'safe-area-inset-bottom': 'env(safe-area-inset-bottom)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
