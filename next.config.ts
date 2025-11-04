import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://simple-creature-website-assets.s3.amazonaws.com/**")],
  },
  devIndicators: {
    position: "bottom-right",
  },
}

export default nextConfig
