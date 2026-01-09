import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import LofiPlayer from "./components/LofiPlayer";
import MiniPlayerPomodoro from "./components/MiniPlayerPomodoro";
import Sidebar from "./components/Sidebar";
import ToastProvider from "./components/ToastProvider";
import { LofiProvider } from "./context/LofiContext";
import { PomodoroProvider } from "./context/PomodoroContext";
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
    <ClerkProvider>
      <html lang="pt-BR">
        <body
          className={`${montserrat.variable} font-sans bg-primary text-light antialiased flex`}
        >
          <PomodoroProvider>
            <LofiProvider>
              <Sidebar />
              <main className="flex-1 h-screen overflow-y-auto p-8">
                {children}
              </main>
              <LofiPlayer />
              <MiniPlayerPomodoro />
              <ToastProvider />
            </LofiProvider>
          </PomodoroProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
