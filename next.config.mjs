/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sftybvsuremldvtipxoq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/*",
      },
    ],
  },
};

export default nextConfig;
