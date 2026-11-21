import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Lato, Playfair_Display } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-lato" });

export const metadata: Metadata = {
  title: "The Wedding of Debrion & Nonaventa",
  description: "Dengan penuh rasa syukur, kami mengundang Anda untuk berbagi kebahagiaan di hari pernikahan kami.",
  openGraph: {
    title: "The Wedding of Debrion & Nonaventa",
    description: "Kami menantikan kehadiran dan doa restu Anda.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf6f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${cormorant.variable} ${playfair.variable} ${jost.variable} ${lato.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
