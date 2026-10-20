import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // saída standalone — necessária para o script start local e aceita pela Vercel
  output: "standalone",
  reactStrictMode: false,
  images: {
    // hostnames de imagens externas (capas de vídeo YouTube/Vimeo e CDNs usadas pelo painel)
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
