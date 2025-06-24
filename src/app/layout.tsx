import type { Metadata } from "next";
import "./globals.css";
import "@near-wallet-selector/modal-ui/styles.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./Providers";
import localFont from "next/font/local";
import getWebsiteUrl from "@/utils/getWebsiteUrl";
import CookiesConsent from "@/components/CookiesConsent";
import type { Viewport } from "next";
import BannedAddressConnected from "@/components/Modals/BannedAddressConnected";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const monaSans = localFont({
  src: [
    {
      path: "./fonts/MonaSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MonaSans-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/MonaSans-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/MonaSans-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/MonaSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/MonaSans-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-monaSans",
});

const fkGrotesk = localFont({
  src: [
    {
      path: "./fonts/FKGrotesk-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/FKGrotesk-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/FKGrotesk-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/FKGrotesk-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/FKGrotesk-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/FKGrotesk-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-fkGrotesk",
});

const url = getWebsiteUrl();

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Get started with NEAR",
  },
  description:
    "Gain an understanding of the open web and the role of NEAR in that vision.",
  openGraph: {
    url,
    siteName: "Get started with NEAR",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${url}/og.png`,
        width: 1200,
        height: 630,
        alt: "Get started with NEAR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nearprotocol",
    images: [`${url}/og.png`],
  },
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "mask-icon",
      url: "/safari-pinned-tab.svg",
      color: "#5bbad5",
    },
  ],
  manifest: "/site.webmanifest",
  themeColor: "#ffffff",
  other: {
    name: "msapplication-TileColor",
    content: "#000000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`flex min-h-screen flex-col font-mono ${fkGrotesk.variable} ${monaSans.variable}`}
      >
        <Providers>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
          <CookiesConsent />
          <BannedAddressConnected />
        </Providers>
      </body>
    </html>
  );
}
