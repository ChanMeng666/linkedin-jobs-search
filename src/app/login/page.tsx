"use client";

import Link from 'next/link';
import Image from 'next/image';
import { SignIn, SignUp, useUser } from '@stackframe/stack';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Check URL parameter for initial mode
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup') {
      setMode('signup');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex">
      {/* Left: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-24 bg-white">
        <div className="max-w-sm mx-auto w-full">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-12 group">
            <Image
              src="/assets/images/linkedin-jobs-search-logo.svg"
              alt="Logo"
              width={32}
              height={32}
            />
            <span className="font-medium text-stone-700">JobSearch</span>
          </Link>

          {mode === 'signin' ? (
            <>
              <h1 className="text-2xl font-semibold text-stone-900 mb-2">Sign in</h1>
              <p className="text-stone-500 mb-10">Continue to your account</p>
              <SignIn />
              <p className="text-sm text-stone-500 mt-8">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-stone-900 mb-2">Create account</h1>
              <p className="text-stone-500 mb-10">Start your job search journey</p>
              <SignUp />
              <p className="text-sm text-stone-500 mt-8">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </>
          )}

          <p className="text-xs text-stone-400 mt-6">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-stone-500 hover:text-stone-700">Terms</Link>
            {' '}&{' '}
            <Link href="/privacy" className="text-stone-500 hover:text-stone-700">Privacy</Link>
          </p>
        </div>
      </div>

      {/* Right: Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden gradient-brand">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.08]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 text-center px-12">
          <h2 className="text-3xl font-light text-white mb-3 tracking-tight">
            {mode === 'signin' ? 'Welcome back' : 'Join thousands of job seekers'}
          </h2>
          <p className="text-white/60 text-lg">
            {mode === 'signin'
              ? 'Search, save, and track jobs — all in one place.'
              : 'Create a free account to unlock all features.'}
          </p>
        </div>
      </div>
    </div>
  );
}
