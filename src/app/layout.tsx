import type { Metadata } from 'next';
import { StackProvider } from '@/components/providers/StackProvider';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'LinkedIn Jobs Search - Smart Job Search Platform',
  description: 'Search LinkedIn jobs across multiple countries, save favorites, track applications, and analyze market trends.',
  icons: {
    icon: '/assets/images/linkedin-jobs-search-logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 flex flex-col">
        <StackProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </StackProvider>
      </body>
    </html>
  );
}
