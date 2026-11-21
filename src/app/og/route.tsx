import { ImageResponse } from "next/og";
import { churchProfile } from "@/config/church-profile";

export const dynamic = "force-static";

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
            "radial-gradient(circle at 82% 20%, rgba(34,197,94,.32), transparent 34%), linear-gradient(135deg, #08140e 0%, #102019 58%, #173b2a 100%)",
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
              background: "#14532d",
              boxShadow: "0 8px 24px rgba(34,197,94,.24)",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 64 64" aria-hidden="true">
              <path fill="#22c55e" d="M32 4c2.8 12.4 15.2 17.7 16.8 30.4A17 17 0 0 1 32 53.5a17 17 0 0 1-16.8-19.1c1-8.4 6.5-15.1 12.4-20.4-.1 6.2 1.6 10 4.6 13.2C35 21 35 13.3 32 4Z" />
              <path fill="#a3e635" d="M30.2 20.6c1.3 6.3 5.6 10.8 5.6 17a7.8 7.8 0 1 1-15.6 0c.4-5.3 4.2-9.4 8-12.8.1 3.5.7 5.2 2 6.5 1.2-3.1.7-6.9 0-10.7Z" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 25, fontWeight: 700 }}>{churchProfile.name}</span>
            <span style={{ color: "#cbd5e1", fontSize: 15, letterSpacing: 2 }}>
              {churchProfile.denomination.toUpperCase()} · AMBATO, ECUADOR
            </span>
          </div>
        </div>

        <div style={{ display: "flex", maxWidth: 940, flexDirection: "column", gap: 20 }}>
          <div style={{ width: 72, height: 4, borderRadius: 9, background: "#a3e635" }} />
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
