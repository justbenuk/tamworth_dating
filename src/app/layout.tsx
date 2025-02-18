import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";
import TopNav from "@/components/navbar/topnav";
export const metadata: Metadata = {
  title: "Next Match",
  description: "A dating service created with NextJS",
};

type RootProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TopNav />
          <main className="container mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
