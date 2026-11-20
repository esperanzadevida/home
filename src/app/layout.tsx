import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Doménica | Asambleas de Dios",
  description:
    "Una comunidad de fe en Ambato que celebra, aprende y sirve junto a cada generación.",
  icons: { icon: "/favicon.svg" },
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
