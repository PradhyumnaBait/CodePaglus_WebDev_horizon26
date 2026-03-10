import type { Metadata, Viewport } from 'next';
import './globals.css';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { SocketProvider } from '@/lib/providers/SocketProvider';

export const metadata: Metadata = {
  title: {
    default:  'OpsPulse — Business Health Dashboard',
    template: '%s | OpsPulse',
  },
  description:
    'Real-time business health monitoring dashboard for SMB operations. Track stress scores, manage alerts, and coordinate crisis response.',
  keywords:   ['business dashboard', 'operations monitoring', 'SMB analytics', 'real-time alerts'],
  authors:    [{ name: 'OpsPulse Team' }],
};

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width:      'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <QueryProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
