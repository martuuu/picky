import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PICKY - REVOLUCIÓN EN RETAIL",
  description: "Experiencia Smart Shopping revolucionaria. Escanea, compara y compra en el corralón más innovador. Tecnología de punta para tu construcción.",
  keywords: ["corralón", "construcción", "smart shopping", "retail", "materiales", "herramientas", "picky"],
  authors: [{ name: "Picky" }],
  creator: "Picky",
  publisher: "Picky",
  icons: {
    icon: [
      { url: "/picky-small-round.png", sizes: "any" },
      { url: "/picky-small-round.png", type: "image/png" },
    ],
    apple: "/picky-small-round.png",
  },
  openGraph: {
    title: "PICKY - REVOLUCIÓN EN RETAIL",
    description: "Experiencia Smart Shopping revolucionaria",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "PICKY - REVOLUCIÓN EN RETAIL",
    description: "Experiencia Smart Shopping revolucionaria",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} antialiased font-display`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
