import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VRM Human Tracking Lab",
  description: "Next.js client-side webcam tracking with Human, Three.js and VRM retargeting.",
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
