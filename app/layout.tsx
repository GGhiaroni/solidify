import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Sidebar from "./components/Sidebar";
import ToastProvider from "./components/ToastProvider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "solidify",
  description: "solidify your knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-sans bg-primary text-light antialiased flex`}
      >
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto p-8">
          {children}
          <ToastProvider />
        </main>
      </body>
    </html>
  );
}
