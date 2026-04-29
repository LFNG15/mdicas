/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.media-amazon.com" },
      { protocol: "https", hostname: "**.images-amazon.com" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "**.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
