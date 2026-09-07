import type { NextConfig } from "next";

const config: NextConfig = {
  async headers() {
    return [
      {
        // The hero footage never mutates in place; a new cut gets a new filename.
        source: "/hero.:ext(mp4|webm)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default config;
