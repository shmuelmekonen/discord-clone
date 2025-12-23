import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "ufs.sh" },
    ],
  },
  // פותר את בעיית ה-README וה-CTS ב-Next 16
  transpilePackages: [
    "@uploadthing/react",
    "uploadthing",
    "@uploadthing/shared",
  ],
};

export default nextConfig;
