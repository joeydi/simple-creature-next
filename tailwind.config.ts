import type { Config } from "tailwindcss"

const config: Config = {
  // Only scan backend/admin files - frontend uses SCSS
  content: [
    "./app/(admin)/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/(dashboard)/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/(auth)/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/admin/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/dashboard/**/*.{js,ts,jsx,tsx,mdx}",
    "@/components/admin/**/*.{js,ts,jsx,tsx,mdx}",
    "@/components/dashboard/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
}
export default config
