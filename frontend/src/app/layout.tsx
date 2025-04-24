import './globals.css';
import type { Metadata } from 'next';
import SidebarButtons from '../components/SidebarButtons';
import SidebarLinks from '../components/SidebarLinks';
import HistoryPanel from '../components/HistoryPanel';
import Loader from '../components/Loader'; // 👈 Loader import

export const metadata: Metadata = {
  title: 'AlChemist',
  description: 'AI-powered Gemini Chat Interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#0e1d31] text-white font-display">
        {/* Loader Overlay */}
        <Loader />

        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#0e1d31] text-white px-6 py-6 flex flex-col justify-between shadow-lg">
          <div>
            {/* Branded AlChemist Logo */}
            <div className="mb-10 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg animate-pulse">
                  🧪
                </div>
              </div>
              <h1 className="text-2xl font-extrabold tracking-wider font-mono">
                <span className="text-white">Al</span>
                <span className="text-neonCyan glow-text">Chemist</span>
              </h1>
            </div>

            <SidebarLinks />
            <SidebarButtons />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
        <HistoryPanel />
      </body>
    </html>
  );
}
