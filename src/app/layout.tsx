import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";

const fkGrotesk = localFont({
  src: [
    {
      path: "./fonts/FKGrotesk-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-fkGrotesk",
});

export const metadata: Metadata = {
  title: "Coming soon",
  description: "Coming soon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`flex min-h-screen flex-col  ${fkGrotesk.variable} font-sans flex flex-col justify-center items-center h-screen text-2xl font-bold`}
      >
        {children}
      </body>
    </html>
  );
}
