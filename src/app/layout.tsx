import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://naanda.my.id"),
  title: "Naanda",
  description: "A personal page. This sentence is a placeholder.",
  openGraph: {
    title: "Naanda",
    description: "A personal page. This sentence is a placeholder.",
    siteName: "Naanda",
    type: "website",
    images: [
      {
        url: "/images/pile/bg-sq.jpg",
        width: 2400,
        height: 2016,
        alt: "Naanda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naanda",
    description: "A personal page. This sentence is a placeholder.",
    images: ["/images/pile/bg-sq.jpg"],
  },
  icons: {
    icon: "/sites/un.ms-9e73fc9e/pile-7b2b2b3f/pile-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body>{children}</body>
    </html>
  );
}
