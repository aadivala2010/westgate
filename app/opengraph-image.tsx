import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — lawn care in Lancaster, Pennsylvania`;

export default async function Image() {
  // Same white-chip treatment as the header: the supplied mark is a JPEG with a
  // baked white background, so it gets a chip rather than sitting on the ink.
  const mark = await readFile(join(process.cwd(), "public", "logo-mark.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0C110D",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              width: 88,
              height: 88,
              borderRadius: 12,
              background: "#FFFFFF",
              padding: 10,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={markSrc} width={68} height={68} alt="" />
          </div>
          <div style={{ fontSize: 34, color: "#F4F5F2", letterSpacing: -0.5 }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 2, width: 140, background: "#6DB26C", marginBottom: 36 }} />
          {/* Satori needs one text node per div, so the headline is two rows. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              color: "#F4F5F2",
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            <div>Weekly mowing in</div>
            <div>Lancaster, Pennsylvania</div>
          </div>
          <div style={{ marginTop: 34, fontSize: 32, color: "#8E9A8C" }}>
            {`${site.phone.display} — call or text`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
