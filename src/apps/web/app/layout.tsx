import type { Metadata } from 'next';
import './globals.css';

// Import the permanent UI components here
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';

export const metadata: Metadata = {
  title: 'VACTIT',
  description: 'Web Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">

            {/* {children} is where the specific page content (Overview, Exam) will appear */}
            <main className="content">
              {children}
            </main>
      </body>
    </html>
  );
}