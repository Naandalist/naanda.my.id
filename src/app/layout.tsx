import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pile / UNMS",
  description: "Desktop app for reflective journaling. It's private, integrates with AI, and free.",
  openGraph: {
    title: "Pile",
    description: "Desktop app for reflective journaling. It's private, integrates with AI, and free.",
    url: "https://un.ms/pile",
    siteName: "UNMS",
    type: "website",
    images: [
      {
        url: "https://un.ms/assets/pile/pile-logo.png",
        width: 500,
        height: 500,
        alt: "Pile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pile",
    description: "Desktop app for reflective journaling. It's private, integrates with AI, and free.",
    images: ["https://un.ms/assets/pile/pile-logo.png"],
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
