import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contexto LSC Demo",
  description: "Demo funcional de accesibilidad con captura semántica del DOM y avatar VRM para reproducción contextual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
