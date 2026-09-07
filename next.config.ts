import type { NextConfig } from "next";

const config: NextConfig = {
  async headers() {
    return [
      {
        // Frames are content-addressed by filename and never mutate in place.
        source: "/frames/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default config;
