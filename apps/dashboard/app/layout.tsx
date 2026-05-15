import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuru Educator Dashboard",
  description: "Manage lessons and organizations for Nuru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
