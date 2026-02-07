import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 90],
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
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  serverExternalPackages: ["fluent-ffmpeg", "@ffprobe-installer/ffprobe"],
}

export default nextConfig
