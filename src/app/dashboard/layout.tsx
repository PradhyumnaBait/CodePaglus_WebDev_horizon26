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
    <div className="flex h-screen overflow-hidden bg-[#0F172A]">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Sticky Navbar */}
        <Navbar />

        {/* Simulator — active in all dashboard pages */}
        <SimulatorProvider enabled scenario="normal">
          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
        </SimulatorProvider>
      </div>
    </div>
  );
}
