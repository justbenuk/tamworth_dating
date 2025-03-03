import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";
import TopNav from "@/components/navbar/topnav";
import { auth } from "@/auth";
export const metadata: Metadata = {
  title: "Next Match",
  description: "A dating service created with NextJS",
};

type RootProps = {
  children: ReactNode
}

export default async function RootLayout({ children }: RootProps) {
  const session = await auth()
  const userId = session?.user?.id || null
  return (
    <html lang="en">
      <body>
        <Providers userId={userId}>
          <TopNav />
          <main className="container mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
