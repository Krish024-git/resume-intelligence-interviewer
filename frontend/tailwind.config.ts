import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0E17",
        sidebar: "#0B1020",
        card: {
          DEFAULT: "#121826",
          foreground: "#FFFFFF",
        },
        surface: "#121826",
        border: "#252B3B",
        primary: {
          DEFAULT: "#4F8CFF",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#7C4DFF",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        foreground: "#FFFFFF",
        "text-secondary": "#A1A1AA",
        muted: {
          DEFAULT: "#A1A1AA",
          foreground: "#A1A1AA",
        },
        ring: "#4F8CFF",
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#111827",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #4F8CFF 0%, #7C4DFF 100%)",
        "gradient-radial": "radial-gradient(ellipse at top, rgba(79, 140, 255, 0.08) 0%, transparent 60%)",
        "gradient-glow": "radial-gradient(circle at 50% 0%, rgba(0, 229, 255, 0.10) 0%, transparent 50%)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        glass: "0 18px 40px rgba(0, 0, 0, 0.35)",
        soft: "0 12px 30px rgba(0, 0, 0, 0.28)",
        glow: "0 0 30px rgba(79, 140, 255, 0.12)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
