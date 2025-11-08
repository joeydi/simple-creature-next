import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://simple-creature-website-assets.s3.amazonaws.com/**"),
      new URL("https://simple-creature-next.s3.amazonaws.com/**"),
      new URL("https://simple-creature-next.s3.us-east-1.amazonaws.com/**"),
    ],
  },
  devIndicators: {
    position: "bottom-right",
  },
  experimental: {
    viewTransition: true,
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
}

export default nextConfig
