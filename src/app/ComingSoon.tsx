import React from "react";
import { fkGrotesk } from "./layout";

export default function ComingSoon() {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Coming soon</title>
      </head>
      <body
        className={`flex min-h-screen flex-col items-center justify-center font-mono ${fkGrotesk.variable}`}
      >
        <span className="font-sans text-3xl font-bold">Coming soon</span>
      </body>
    </html>
  );
}
