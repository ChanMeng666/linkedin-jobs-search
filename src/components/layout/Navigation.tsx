"use client";

import { usePathname } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import { Flex, Line, ToggleButton, Avatar, Text } from '@once-ui-system/core';
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
      {/* Fade效果 - 桌面顶部渐隐 */}
      <div className={`${styles.mask} s-flex-hide`} style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 80, zIndex: 8, pointerEvents: 'none' }} />
      {/* Fade效果 - 移动端底部渐隐 */}
      <div className={`${styles.mask} s-flex-show`} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 80, zIndex: 8, pointerEvents: 'none', transform: 'rotate(180deg)' }} />

      {/* 主导航栏 */}
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
        {/* 左侧 - Logo (仅桌面显示) */}
        <Flex paddingLeft="12" fillWidth vertical="center" textVariant="body-default-s">
          <Flex className="s-flex-hide" gap="8" vertical="center">
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

        {/* 中央 - 导航按钮组 */}
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
              {/* 首页 */}
              <ToggleButton
                prefixIcon="home"
                href="/"
                selected={pathname === '/'}
              />

              <Line background="neutral-alpha-medium" vert maxHeight="24" />

              {/* 搜索 - 桌面显示标签，移动端仅图标 */}
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

              {/* Dashboard - 仅登录用户 */}
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

              {/* Analytics - 仅登录用户 */}
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

              {/* 主题切换 */}
              <ThemeToggle />
            </Flex>
          </Flex>
        </Flex>

        {/* 右侧 - 用户信息 (仅桌面显示) */}
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="8"
            className="s-flex-hide"
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
                {user.profileImageUrl ? (
                  <Avatar src={user.profileImageUrl} size="s" />
                ) : (
                  <Avatar value={user.displayName?.[0] || user.primaryEmail?.[0] || 'U'} size="s" />
                )}
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
