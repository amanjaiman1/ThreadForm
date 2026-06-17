import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand — Thread Violet
        brand: {
          50: "#F2EEFF",
          100: "#E4DBFF",
          300: "#B9A4FF",
          500: "#6C3CE9",
          600: "#5A2FD0",
          700: "#481FB0",
          900: "#2A1170",
        },
        // Accent — Volt (high-energy CTA)
        volt: {
          400: "#C6FF4D",
          500: "#A6F000",
          600: "#86C400",
        },
        // Neutrals — the canvas
        ink: {
          900: "#0E0E12",
          700: "#2B2B33",
          500: "#5B5B66",
          400: "#8A8A96",
        },
        line: {
          200: "#E6E6EC",
        },
        surface: {
          0: "#FFFFFF",
          50: "#FAFAFC",
          100: "#F6F6F9",
        },
        // Semantic
        success: "#1FA971",
        warning: "#E0A100",
        danger: "#E5484D",
        info: "#2F77F0",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // role-based scale from DESIGN_SYSTEM.md (1.250 major third)
        display: ["clamp(2.75rem, 6vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        h1: ["clamp(2.25rem, 5vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["clamp(1.75rem, 4vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.33", letterSpacing: "-0.01em", fontWeight: "600" }],
        lead: ["1.25rem", { lineHeight: "1.4", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.43" }],
        xs: ["0.75rem", { lineHeight: "1.33", fontWeight: "500" }],
      },
      spacing: {
        "0.5": "0.125rem",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
        pill: "999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(14,14,18,0.06)",
        sm: "0 2px 8px rgba(14,14,18,0.06)",
        md: "0 8px 24px rgba(14,14,18,0.08)",
        lg: "0 24px 60px rgba(14,14,18,0.12)",
        canvas: "0 30px 80px -20px rgba(42,17,112,0.35)",
        volt: "0 12px 32px -8px rgba(166,240,0,0.45)",
        brand: "0 12px 32px -8px rgba(108,60,233,0.45)",
      },
      maxWidth: {
        content: "1200px",
        wide: "1440px",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        emphasized: "cubic-bezier(0.2, 0, 0, 1.2)",
        exit: "cubic-bezier(0.4, 0, 1, 1)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #6C3CE9, #2A1170)",
        "gradient-volt": "linear-gradient(135deg, #A6F000, #6C3CE9)",
        "grid-faint":
          "linear-gradient(to right, rgba(108,60,233,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(108,60,233,0.06) 1px, transparent 1px)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 30s) linear infinite",
        "marquee-reverse": "marquee-reverse var(--marquee-duration, 30s) linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
