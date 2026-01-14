import LofiPlayer from "../components/LofiPlayer";
import MiniPlayerPomodoro from "../components/MiniPlayerPomodoro";
import Sidebar from "../components/Sidebar";
import ToastProvider from "../components/ToastProvider";
import { LofiProvider } from "../context/LofiContext";
import { PomodoroProvider } from "../context/PomodoroContext";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
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
    </div>
  );
}
