import type { Metadata } from "next";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Knowledge Base Graphs",
  description: "Interactive knowledge mapping tool for notes and topics.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        {children}
        <Toaster theme="dark" position="bottom-right" closeButton richColors />
      </body>
    </html>
  );
}
