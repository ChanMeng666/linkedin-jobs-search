"use client";

import { usePathname } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import { Fade, Flex, Line, ToggleButton, Avatar, Text } from '@once-ui-system/core';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import styles from './Navigation.module.scss';

export function Navigation() {
  const pathname = usePathname() ?? '';
  const user = useUser();

  const handleSignOut = async () => {
    if (user) {
      await user.signOut();
    }
    window.location.href = '/';
  };

  return (
    <>
      {/* Fade effect - top on desktop, bottom on mobile */}
      <Fade hide="s" fillWidth position="fixed" height="80" zIndex={9} />
      <Fade show="s" fillWidth position="fixed" bottom="0" to="top" height="80" zIndex={9} />

      {/* Main Navigation */}
      <Flex
        fitHeight
        position="unset"
        className={styles.position}
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
      >
        {/* Left section - Logo on desktop */}
        <Flex paddingLeft="12" fillWidth vertical="center" textVariant="body-default-s">
          <Flex hide="s" gap="8" vertical="center">
            <img
              src="/assets/images/linkedin-jobs-search-logo.svg"
              alt="JobSearch"
              style={{ width: 28, height: 28 }}
            />
            <Text variant="label-strong-s" onBackground="neutral-strong">
              JobSearch
            </Text>
          </Flex>
        </Flex>

        {/* Center - Navigation */}
        <Flex fillWidth horizontal="center">
          <Flex
            background="surface"
            border="neutral-alpha-weak"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
            className={styles.navContainer}
          >
            <Flex gap="4" vertical="center" textVariant="body-default-s">
              {/* Home */}
              <ToggleButton
                prefixIcon="home"
                href="/"
                selected={pathname === '/'}
              />

              <Line background="neutral-alpha-medium" vert maxHeight="24" />

              {/* Search */}
              <ToggleButton
                className="s-flex-hide"
                prefixIcon="search"
                href="/search"
                label="Search"
                selected={pathname === '/search'}
              />
              <ToggleButton
                className="s-flex-show"
                prefixIcon="search"
                href="/search"
                selected={pathname === '/search'}
              />

              {/* Dashboard - only for logged in users */}
              {user && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="grid"
                    href="/dashboard"
                    label="Dashboard"
                    selected={pathname === '/dashboard'}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="grid"
                    href="/dashboard"
                    selected={pathname === '/dashboard'}
                  />
                </>
              )}

              {/* Analytics - only for logged in users */}
              {user && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="chart"
                    href="/analytics"
                    label="Analytics"
                    selected={pathname === '/analytics'}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="chart"
                    href="/analytics"
                    selected={pathname === '/analytics'}
                  />
                </>
              )}

              {/* API Docs */}
              <ToggleButton
                className="s-flex-hide"
                prefixIcon="document"
                href="/api-docs"
                label="API"
                selected={pathname === '/api-docs'}
              />
              <ToggleButton
                className="s-flex-show"
                prefixIcon="document"
                href="/api-docs"
                selected={pathname === '/api-docs'}
              />

              <Line background="neutral-alpha-medium" vert maxHeight="24" />

              {/* Theme Toggle */}
              <ThemeToggle />
            </Flex>
          </Flex>
        </Flex>

        {/* Right section - User/Auth */}
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="8"
            hide="s"
          >
            {!user ? (
              <>
                <ToggleButton
                  href="/login"
                  label="Sign In"
                />
                <ToggleButton
                  href="/search"
                  label="Get Started"
                  selected
                />
              </>
            ) : (
              <Flex gap="8" vertical="center">
                <Avatar
                  src={user.profileImageUrl || undefined}
                  value={user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
                  size="s"
                />
                <Text variant="body-default-s" onBackground="neutral-medium">
                  {user.displayName || user.primaryEmail?.split('@')[0]}
                </Text>
                <ToggleButton
                  prefixIcon="arrowRight"
                  onClick={handleSignOut}
                  aria-label="Sign out"
                />
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
