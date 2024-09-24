import "./globals.css";
import React from 'react';

export const metadata = {
  title: "Audio converter",
  description: "Convert MP3 & WAV audio files into OGG format.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html >
  );
}
