import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo/site";

export const runtime = "edge";
export const alt = "MD — Ofertas, Listas e Achados";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CORAL = "#F07B6E";
const CORAL_DARK = "#D9685C";
const CORAL_LIGHT = "#F5A49B";
const CREAM = "#FAF3EF";
const TEXT_DARK = "#2C1810";
const TEXT_MID = "#5A3D2E";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(165deg, ${CREAM} 0%, #FFFBF8 60%, rgba(240,123,110,0.15) 100%)`,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Bolhas decorativas */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background: `radial-gradient(circle, rgba(240,123,110,0.18) 0%, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: 9999,
            background: `radial-gradient(circle, rgba(240,123,110,0.10) 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Logo M|D */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            fontSize: 240,
            fontWeight: 700,
            color: CORAL,
            letterSpacing: "0.02em",
            lineHeight: 1,
            marginBottom: 30,
          }}
        >
          <span>M</span>
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 180,
              background: CORAL,
              margin: "0 18px",
              marginTop: 12,
            }}
          />
          <span>D</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            color: CORAL_DARK,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 36,
              height: 2,
              background: CORAL,
            }}
          />
          Economia Inteligente
          <span
            style={{
              display: "inline-block",
              width: 36,
              height: 2,
              background: CORAL,
            }}
          />
        </div>

        {/* Descrição */}
        <div
          style={{
            fontSize: 36,
            color: TEXT_DARK,
            textAlign: "center",
            maxWidth: 880,
            lineHeight: 1.35,
            padding: "0 60px",
            fontStyle: "italic",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Qualidade que cabe no seu bolso.
        </div>

        {/* Rodapé com URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 22,
            color: TEXT_MID,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 500,
            display: "flex",
          }}
        >
          {SITE.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
