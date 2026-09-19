import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PILLARS } from "@/lib/pillars";

/* The preview card shown when a link is shared (WhatsApp, LinkedIn,
   Facebook, X). Rendered to a PNG once, at build time.

   Not the hero in miniature: a share card is seen small, in a chat or a
   feed, next to other people's links. Its job is recognition — who this is
   and what they do, legible at thumbnail size. So the company name leads,
   large; the site's title line says what SKY Tech does; the three pillars
   sit underneath as the brief. The brand blue running into navy is the
   site's own panel colouring, and the registration marks at the corners are
   its drafting vocabulary.

   The image generator cannot use the site's web fonts (it reads TTF, not
   WOFF2), so it has its own copies of the same families in assets/fonts —
   Space Grotesk, Manrope and JetBrains Mono, from Fontsource, SIL Open Font
   License. They are read at build time only and never sent to visitors. */

export const alt = "SKY Tech Dynamic — Web Development, Digital Marketing & AI Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CYAN = "#00c2ff";
const MARK = "rgba(255,255,255,0.4)";
const INSET = 56;

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

/* A registration mark: two hairlines crossing. */
function Cross({ x, y }: { x: number; y: number }) {
  return (
    <div style={{ position: "absolute", left: x - 8, top: y - 8, width: 17, height: 17, display: "flex" }}>
      <div style={{ position: "absolute", left: 8, top: 0, width: 1, height: 17, backgroundColor: MARK }} />
      <div style={{ position: "absolute", left: 0, top: 8, width: 17, height: 1, backgroundColor: MARK }} />
    </div>
  );
}

export default async function OpengraphImage() {
  const [bold, medium, mono] = await Promise.all([
    font("SpaceGrotesk-Bold.ttf"),
    font("SpaceGrotesk-Medium.ttf"),
    font("JetBrainsMono-Medium.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          color: "#ffffff",
          backgroundColor: "#0b1f35",
          backgroundImage:
            "radial-gradient(70% 90% at 100% 0%, rgba(0,194,255,0.28), transparent 60%), linear-gradient(135deg, #006bb8 0%, #0b1f35 64%)",
        }}
      >
        {/* Drafting grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.09,
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* The drafting frame: an inset hairline, marked at its corners */}
        <div
          style={{
            position: "absolute",
            left: INSET,
            top: INSET,
            right: INSET,
            bottom: INSET,
            display: "flex",
            border: "1px solid rgba(255,255,255,0.16)",
          }}
        />
        <Cross x={INSET} y={INSET} />
        <Cross x={1200 - INSET} y={INSET} />
        <Cross x={INSET} y={630 - INSET} />
        <Cross x={1200 - INSET} y={630 - INSET} />

        <div
          style={{
            position: "absolute",
            left: INSET + 48,
            right: INSET + 48,
            top: INSET + 40,
            bottom: INSET + 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Where we work */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: "JetBrains Mono",
              fontSize: 16,
              letterSpacing: 5,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            <div style={{ width: 44, height: 2, backgroundColor: CYAN }} />
            PAKISTAN · USA · UK
          </div>

          {/* Who, and what they do */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  fontSize: 96,
                  lineHeight: 1,
                  letterSpacing: -3.5,
                }}
              >
                SKY Tech Dynamic
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "JetBrains Mono",
                  fontSize: 18,
                  letterSpacing: 5,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                PVT. LTD.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontFamily: "Space Grotesk",
                fontWeight: 500,
                fontSize: 36,
                letterSpacing: -0.6,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Web Development, Digital Marketing &amp; AI Solutions
            </div>
          </div>

          {/* The brief: the three pillars */}
          <div style={{ display: "flex", gap: 12 }}>
            {PILLARS.map((pillar) => (
              <div
                key={pillar.index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.22)",
                  backgroundColor: "rgba(11,31,53,0.35)",
                }}
              >
                <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 14, color: CYAN, letterSpacing: 2 }}>
                  {pillar.index}
                </div>
                <div style={{ display: "flex", fontFamily: "Space Grotesk", fontWeight: 500, fontSize: 19 }}>
                  {pillar.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: bold, weight: 700, style: "normal" },
        { name: "Space Grotesk", data: medium, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}
