import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naanda",
  description: "A personal page. This sentence is a placeholder.",
  openGraph: {
    title: "Naanda",
    description: "A personal page. This sentence is a placeholder.",
    siteName: "Naanda",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Naanda",
    description: "A personal page. This sentence is a placeholder.",
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
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
