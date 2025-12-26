"use client";

import Link from 'next/link';
import Image from 'next/image';
import { SignIn, useUser } from '@stackframe/stack';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const contextMessages: Record<string, string> = {
    dashboard: 'Please sign in to access your dashboard.',
    analytics: 'Please sign in to view market analytics.',
    save: 'Sign in to save jobs to your collection.',
    export: 'Sign in to export your search results.',
  };

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Left Panel: Login Form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center p-8 lg:p-12">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <Image
              src="/assets/images/linkedin-jobs-search-logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="transition-transform group-hover:scale-105"
            />
            <span className="font-semibold text-stone-800">JobSearch</span>
          </Link>

          {/* Context Message */}
          {from && contextMessages[from] && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700">{contextMessages[from]}</p>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Welcome back</h1>
            <p className="text-stone-600">Sign in to continue to your dashboard</p>
          </div>

          {/* Stack Auth SignIn Component */}
          <div className="mb-8">
            <SignIn />
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-stone-50 text-xs text-stone-500 uppercase tracking-wider">Secure authentication</span>
            </div>
          </div>

          {/* Quick Features */}
          <div className="space-y-3 text-sm text-stone-600">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>No password required - secure OAuth login</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your data is encrypted and protected</span>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-stone-500 mt-8">
            By continuing, you agree to our{' '}
            <Link href="#" className="text-blue-600 hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>

          {/* Back Link */}
          <div className="mt-6">
            <Link href="/" className="text-sm text-stone-600 hover:text-stone-900 inline-flex items-center gap-2 group">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel: Features */}
      <div className="hidden lg:flex lg:w-7/12 p-12 items-center justify-center relative overflow-hidden gradient-brand">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-serif text-white mb-4">
            Unlock the full power of job search
          </h2>
          <p className="text-white/80 text-lg mb-12">
            Create a free account to access all features and take your job hunt to the next level.
          </p>

          {/* Feature Cards */}
          <div className="space-y-6">
            <FeatureCard
              icon={<BookmarkIcon />}
              title="Save & Organize Jobs"
              description="Bookmark interesting positions and track your application status in one place."
              color="blue"
            />
            <FeatureCard
              icon={<ChartIcon />}
              title="Export to Excel"
              description="Download your search results and saved jobs in spreadsheet format."
              color="pink"
            />
            <FeatureCard
              icon={<AnalyticsIcon />}
              title="Market Analytics"
              description="View salary trends, demand insights, and location-based job market data."
              color="blue"
            />
            <FeatureCard
              icon={<ClockIcon />}
              title="Search History"
              description="Access your previous searches and quickly repeat them with one click."
              color="pink"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'pink';
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg">
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          color === 'blue' ? 'bg-blue-100' : 'bg-pink-100'
        }`}>
          <div className={color === 'blue' ? 'text-brand-primary' : 'text-pink-500'}>
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-stone-800 font-semibold mb-1">{title}</h3>
          <p className="text-stone-500 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Icons
function BookmarkIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
