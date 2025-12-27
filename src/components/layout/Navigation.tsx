"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { Flex, Button, Text, Line, Avatar, IconButton, Fade } from '@once-ui-system/core';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export function Navigation() {
  const pathname = usePathname() ?? '';
  const user = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    if (user) {
      await user.signOut();
    }
    window.location.href = '/';
  };

  const isActive = (path: string) => pathname === path;

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Button
        variant={isActive(href) ? 'primary' : 'tertiary'}
        size="s"
      >
        {children}
      </Button>
    </Link>
  );

  return (
    <>
      {/* Fade effect on scroll */}
      <Fade hide="s" fillWidth position="fixed" height="80" zIndex={8} />

      {/* Main Navigation */}
      <Flex
        as="nav"
        position="fixed"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        style={{ top: '16px' }}
      >
        <Flex
          maxWidth="l"
          fillWidth
          horizontal="space-between"
          vertical="center"
          padding="8"
          paddingX="16"
          radius="l"
          background="surface"
          border="neutral-alpha-weak"
          shadow="l"
          className="glass-card"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Flex gap="8" vertical="center" className="hover-lift">
              <Image
                src="/assets/images/linkedin-jobs-search-logo.svg"
                alt="JobSearch Logo"
                width={36}
                height={36}
              />
              <Text
                variant="heading-strong-s"
                onBackground="neutral-strong"
                hide="s"
              >
                JobSearch
              </Text>
            </Flex>
          </Link>

          {/* Desktop Navigation */}
          <Flex gap="4" vertical="center" hide="s">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/search">Search</NavLink>
            {user && (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/analytics">Analytics</NavLink>
              </>
            )}
            <NavLink href="/api-docs">API</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
          </Flex>

          {/* Desktop Right Section */}
          <Flex gap="8" vertical="center" hide="s">
            <ThemeToggle />
            <Line vert background="neutral-alpha-medium" maxHeight="24" />

            {!user ? (
              // Guest State
              <>
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <Button variant="tertiary" size="s">
                    Sign In
                  </Button>
                </Link>
                <Link href="/search" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="s">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              // Authenticated State
              <div style={{ position: 'relative' }}>
                <Flex
                  gap="8"
                  vertical="center"
                  padding="4"
                  paddingX="8"
                  radius="m"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{ cursor: 'pointer' }}
                  className="card-interactive"
                >
                  <Avatar
                    src={user.profileImageUrl || '/assets/images/default-avatar.svg'}
                    size="s"
                  />
                  <Text variant="body-default-s" onBackground="neutral-strong">
                    {user.displayName || user.primaryEmail?.split('@')[0] || 'User'}
                  </Text>
                  <svg
                    style={{
                      width: 16,
                      height: 16,
                      transition: 'transform 0.2s',
                      transform: userDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Flex>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <Flex
                    direction="column"
                    position="absolute"
                    background="surface"
                    border="neutral-alpha-weak"
                    radius="l"
                    shadow="l"
                    padding="8"
                    gap="4"
                    style={{
                      right: 0,
                      top: '100%',
                      marginTop: 8,
                      minWidth: 220,
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      zIndex: 100,
                    }}
                    className="animate-fade-in-up"
                  >
                    {/* User Info */}
                    <Flex gap="12" padding="8" vertical="center">
                      <Avatar
                        src={user.profileImageUrl || '/assets/images/default-avatar.svg'}
                        size="m"
                      />
                      <Flex direction="column" gap="2">
                        <Text variant="label-strong-s">
                          {user.displayName || 'User'}
                        </Text>
                        <Text variant="body-default-xs" onBackground="neutral-weak">
                          {user.primaryEmail}
                        </Text>
                      </Flex>
                    </Flex>

                    <Line background="neutral-alpha-weak" />

                    <Link href="/dashboard" style={{ textDecoration: 'none' }} onClick={() => setUserDropdownOpen(false)}>
                      <Flex padding="8" radius="s" gap="8" vertical="center" className="card-interactive">
                        <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <Text variant="body-default-s">Dashboard</Text>
                      </Flex>
                    </Link>

                    <Link href="/analytics" style={{ textDecoration: 'none' }} onClick={() => setUserDropdownOpen(false)}>
                      <Flex padding="8" radius="s" gap="8" vertical="center" className="card-interactive">
                        <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <Text variant="body-default-s">Analytics</Text>
                      </Flex>
                    </Link>

                    <Line background="neutral-alpha-weak" />

                    <Flex
                      padding="8"
                      radius="s"
                      gap="8"
                      vertical="center"
                      onClick={handleSignOut}
                      style={{ cursor: 'pointer' }}
                      className="card-interactive"
                    >
                      <svg style={{ width: 16, height: 16, color: 'var(--danger-on-background-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <Text variant="body-default-s" onBackground="danger-strong">Sign Out</Text>
                    </Flex>
                  </Flex>
                )}
              </div>
            )}
          </Flex>

          {/* Mobile Menu Toggle */}
          <Flex show="s" gap="8" vertical="center">
            <ThemeToggle />
            <IconButton
              icon={mobileMenuOpen ? 'close' : 'menu'}
              variant="ghost"
              size="m"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            />
          </Flex>
        </Flex>
      </Flex>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <Flex
          position="fixed"
          fillWidth
          fillHeight
          zIndex={7}
          background="page"
          direction="column"
          padding="l"
          paddingTop="104"
          gap="16"
          className="animate-fade-in-up"
          show="s"
        >
          <Link href="/" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
            <Button variant={isActive('/') ? 'primary' : 'secondary'} fillWidth size="l">
              Home
            </Button>
          </Link>
          <Link href="/search" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
            <Button variant={isActive('/search') ? 'primary' : 'secondary'} fillWidth size="l">
              Search
            </Button>
          </Link>
          {user && (
            <>
              <Link href="/dashboard" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                <Button variant={isActive('/dashboard') ? 'primary' : 'secondary'} fillWidth size="l">
                  Dashboard
                </Button>
              </Link>
              <Link href="/analytics" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                <Button variant={isActive('/analytics') ? 'primary' : 'secondary'} fillWidth size="l">
                  Analytics
                </Button>
              </Link>
            </>
          )}
          <Link href="/api-docs" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
            <Button variant={isActive('/api-docs') ? 'primary' : 'secondary'} fillWidth size="l">
              API
            </Button>
          </Link>
          <Link href="/pricing" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
            <Button variant={isActive('/pricing') ? 'primary' : 'secondary'} fillWidth size="l">
              Pricing
            </Button>
          </Link>

          <Line background="neutral-alpha-weak" />

          {!user ? (
            <>
              <Link href="/login" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" fillWidth size="l">
                  Sign In
                </Button>
              </Link>
              <Link href="/search" style={{ textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" fillWidth size="l">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Flex gap="12" padding="16" vertical="center" background="surface" radius="l" border="neutral-alpha-weak">
                <Avatar
                  src={user.profileImageUrl || '/assets/images/default-avatar.svg'}
                  size="m"
                />
                <Flex direction="column" gap="2">
                  <Text variant="label-strong-s">
                    {user.displayName || 'User'}
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {user.primaryEmail}
                  </Text>
                </Flex>
              </Flex>
              <Button variant="danger" fillWidth size="l" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          )}
        </Flex>
      )}

      {/* Click outside to close dropdown */}
      {userDropdownOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 6,
          }}
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </>
  );
}
