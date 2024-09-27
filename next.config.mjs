/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "simple-creature-website-assets.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
