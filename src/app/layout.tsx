import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Swap from "./swap";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <Swap>
          <body className={inter.className}>{children}</body>
        </Swap>
      </QueryClientProvider>
    </html>
  );
}