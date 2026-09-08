import type { NextConfig } from "next";

const config: NextConfig = {
  async headers() {
    return [
      {
        // The hero image never mutates in place; new artwork gets a new filename.
        source: "/bg.webp",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default config;
