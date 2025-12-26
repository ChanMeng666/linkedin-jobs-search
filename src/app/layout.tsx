import type { Metadata } from 'next';
import { Suspense } from 'react';
import { StackProvider } from '@/components/providers/StackProvider';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const dynamic = 'force-dynamic';

function NavigationSkeleton() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="w-10 h-10 bg-stone-200 rounded-lg animate-pulse" />
          <div className="hidden md:flex items-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-4 bg-stone-200 rounded animate-pulse" />
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-16 h-8 bg-stone-200 rounded-lg animate-pulse" />
            <div className="w-24 h-10 bg-stone-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </nav>
  );
}

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-stone-50 flex flex-col">
        <StackProvider>
          <Suspense fallback={<NavigationSkeleton />}>
            <Navigation />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </StackProvider>
      </body>
    </html>
  );
}
