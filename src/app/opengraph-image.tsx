import { ImageResponse } from "next/og";

/* The preview card shown when a link is shared (WhatsApp, LinkedIn,
   Facebook, X). Generated once at build time in the site's palette. */

export const alt = "SKY Tech Dynamic — Web Development, Digital Marketing & AI Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#ffffff",
          backgroundColor: "#0b1f35",
          backgroundImage: "linear-gradient(135deg, #006bb8 0%, #0b1f35 62%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 2, backgroundColor: "#00c2ff" }} />
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>
            skytech.com.pk
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>SKY Tech Dynamic</div>
          <div style={{ marginTop: 14, fontSize: 24, letterSpacing: 8, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
            Pvt. Ltd.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 36, lineHeight: 1.25, maxWidth: 820, color: "rgba(255,255,255,0.92)" }}>
            Web Development, Digital Marketing &amp; AI Solutions
          </div>
          <div style={{ display: "flex", width: 72, height: 72, borderRadius: 999, backgroundColor: "#00c2ff" }} />
        </div>
      </div>
    ),
    size
  );
}
