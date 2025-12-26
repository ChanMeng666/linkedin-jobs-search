"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useUser, useStackApp } from '@stackframe/stack';

export function Navigation() {
  const user = useUser();
  const app = useStackApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    if (user) {
      await user.signOut();
    }
    window.location.href = '/';
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/assets/images/linkedin-jobs-search-logo.svg"
                alt="JobSearch Logo"
                width={40}
                height={40}
                className="transition-transform group-hover:scale-105"
              />
              <span className="font-semibold text-stone-800 hidden sm:block">JobSearch</span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center gap-1">
              <li>
                <Link href="/" className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
                  Search
                </Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/analytics" className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
                      Analytics
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/api-docs" className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>

            {/* Desktop CTA / Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                // Guest State
                <>
                  <Link href="/login" className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/search" className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-primary rounded-xl hover:bg-blue-700 transition-colors">
                    Get Started
                  </Link>
                </>
              ) : (
                // Authenticated State
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors"
                  >
                    <Image
                      src={user.profileImageUrl || '/assets/images/default-avatar.svg'}
                      alt="User avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium text-stone-700">
                      {user.displayName || user.primaryEmail?.split('@')[0] || 'User'}
                    </span>
                    <svg className={`w-4 h-4 text-stone-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-2 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user.profileImageUrl || '/assets/images/default-avatar.svg'}
                            alt="User avatar"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 truncate">
                              {user.displayName || 'User'}
                            </p>
                            <p className="text-xs text-stone-500 truncate">
                              {user.primaryEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50" onClick={() => setUserDropdownOpen(false)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link href="/analytics" className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50" onClick={() => setUserDropdownOpen(false)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analytics
                      </Link>
                      <div className="border-t border-stone-100 mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-stone-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white animate-fadeIn">
          <div className="p-4 pt-20">
            <ul className="space-y-2">
              <li>
                <Link href="/" className="block px-4 py-3 text-lg font-medium text-stone-700 hover:bg-stone-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="block px-4 py-3 text-lg font-medium text-stone-700 hover:bg-stone-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Search
                </Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link href="/dashboard" className="block px-4 py-3 text-lg font-medium text-stone-700 hover:bg-stone-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/analytics" className="block px-4 py-3 text-lg font-medium text-stone-700 hover:bg-stone-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                      Analytics
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/api-docs" className="block px-4 py-3 text-lg font-medium text-stone-700 hover:bg-stone-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  API
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="block px-4 py-3 text-lg font-medium text-stone-700 hover:bg-stone-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  Pricing
                </Link>
              </li>
            </ul>

            {/* Mobile Auth Section */}
            <div className="mt-6 pt-6 border-t border-stone-200">
              {!user ? (
                <div className="space-y-3">
                  <Link href="/login" className="block w-full px-4 py-3 text-center font-medium text-stone-700 border-2 border-stone-200 rounded-xl hover:bg-stone-50" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/search" className="block w-full px-4 py-3 text-center font-semibold text-white bg-brand-primary rounded-xl hover:bg-blue-700" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-3 bg-stone-100 rounded-xl">
                    <Image
                      src={user.profileImageUrl || '/assets/images/default-avatar.svg'}
                      alt="User avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium text-stone-900">{user.displayName || 'User'}</p>
                      <p className="text-sm text-stone-500">{user.primaryEmail}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </>
  );
}
