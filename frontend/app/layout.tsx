/* ==========  frontend/app/layout.tsx  ===============*/
import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import AppProviders from "@/PageComponents/Provider/AppProviders";
import Footer from "@/PageComponents/Shared/Footer";
import NavBar from "@/PageComponents/Shared/NavBar";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AKIJ IBOS",
  description: "AKIJ IBOS online test platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-100 text-slate-900 font-[family-name:var(--font-manrope)]">
        <AppProviders>
          <div className="relative flex min-h-full flex-col">
            <NavBar />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
