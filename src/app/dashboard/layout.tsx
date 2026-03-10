import type { Metadata } from 'next';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Navbar } from '@/components/navigation/Navbar';
import { SimulatorProvider } from '@/lib/providers/SimulatorProvider';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F8FB]">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Sticky Navbar */}
        <Navbar />

        {/* Simulator — active in all dashboard pages */}
        <SimulatorProvider enabled scenario="normal">
          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto" style={{ padding: 'clamp(20px, 3vw, 28px) clamp(20px, 3vw, 32px)' }}>
            {/* restored design‑spec max width (1280px) – theme update had bumped this to 1440 */}
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {children}
            </div>
          </main>
        </SimulatorProvider>
      </div>
    </div>
  );
}

