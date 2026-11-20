import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { churchProfile } from "@/config/church-profile";
import {
  getCanonicalUrl,
  getSiteOrigin,
  isIndexableDeployment,
} from "@/lib/site-url";
import "@/styles/globals.css";

const siteOrigin = getSiteOrigin();
const homeCanonical = getCanonicalUrl("/");
const socialImage = getCanonicalUrl("/og");

export const metadata: Metadata = {
  metadataBase: siteOrigin,
  title: {
    default: `${churchProfile.name} | ${churchProfile.denomination} en Ambato`,
    template: `%s | ${churchProfile.name}`,
  },
  description:
    "Una comunidad de fe en Ambato que celebra, aprende y sirve junto a cada generación.",
  robots: {
    index: isIndexableDeployment(),
    follow: isIndexableDeployment(),
  },
  icons: { icon: "/favicon.svg" },
  ...(homeCanonical ? { alternates: { canonical: homeCanonical } } : {}),
  openGraph: {
    title: `${churchProfile.name} | ${churchProfile.denomination} en Ambato`,
    description:
      "Una comunidad de fe en Ambato que celebra, aprende y sirve junto a cada generación.",
    type: "website",
    locale: "es_EC",
    siteName: churchProfile.name,
    ...(homeCanonical ? { url: homeCanonical } : {}),
    ...(socialImage
      ? {
          images: [
            {
              url: socialImage,
              width: 1200,
              height: 630,
              alt: `${churchProfile.name} · ${churchProfile.signature}`,
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: `${churchProfile.name} | ${churchProfile.denomination} en Ambato`,
    description:
      "Una comunidad de fe en Ambato que celebra, aprende y sirve junto a cada generación.",
    ...(socialImage ? { images: [socialImage] } : {}),
  },
  keywords: [
    "Iglesia Cristiana",
    "Asambleas de Dios",
    "Servicios",
    "Sermones",
    "Adoración",
    "Ecuador",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
