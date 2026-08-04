import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Línea de tiempo de la humanidad",
  description: "Línea de tiempo interactiva de la historia de la humanidad",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
