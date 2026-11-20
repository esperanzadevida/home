import { ImageResponse } from "next/og";
import { churchProfile } from "@/config/church-profile";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "64px",
          alignItems: "stretch",
          justifyContent: "space-between",
          flexDirection: "column",
          color: "#f8fafc",
          background:
            "radial-gradient(circle at 82% 20%, rgba(59,130,246,.42), transparent 34%), linear-gradient(135deg, #090a0f 0%, #111420 58%, #172554 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              width: 58,
              height: 58,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              background: "#3b82f6",
              color: "#090a0f",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 25, fontWeight: 700 }}>{churchProfile.name}</span>
            <span style={{ color: "#cbd5e1", fontSize: 15, letterSpacing: 2 }}>
              {churchProfile.denomination.toUpperCase()} · AMBATO, ECUADOR
            </span>
          </div>
        </div>

        <div style={{ display: "flex", maxWidth: 940, flexDirection: "column", gap: 20 }}>
          <div style={{ width: 72, height: 4, borderRadius: 9, background: "#fbbf24" }} />
          <div style={{ fontSize: 63, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>
            Una fe que se vive en comunidad.
          </div>
          <div style={{ color: "#cbd5e1", fontSize: 25 }}>
            Encuentros, mensajes y espacios para caminar juntos.
          </div>
        </div>

        <div style={{ display: "flex", color: "#94a3b8", fontSize: 17 }}>
          {churchProfile.city}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
