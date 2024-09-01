import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";

// eslint-disable-next-line no-restricted-imports
import "./globals.css";

import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@/components/ui/toaster";

const inter = Instrument_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Devlinks",
  description: "Create and share social links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader color="#633CFF" showSpinner={false} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
