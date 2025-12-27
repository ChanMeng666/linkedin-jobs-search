import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '@/resources/custom.css';
import './globals.css';

import type { Metadata } from 'next';
import classNames from 'classnames';
import { Suspense } from 'react';

import { Background, Column, Flex, opacity, SpacingToken } from '@once-ui-system/core';
import { StackProvider } from '@/components/providers/StackProvider';
import { Providers } from '@/components/common/Providers';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { fonts, style, effects, dataStyle, home } from '@/resources';

// Navigation加载骨架屏
function NavigationSkeleton() {
  return (
    <Flex
      fitHeight
      as="header"
      zIndex={9}
      fillWidth
      padding="8"
      horizontal="center"
    >
      <Flex
        background="surface"
        border="neutral-alpha-weak"
        radius="m-4"
        shadow="l"
        padding="4"
        horizontal="center"
        style={{ width: 300, height: 40 }}
      />
    </Flex>
  );
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: home.title,
  description: home.description,
  icons: {
    icon: '/assets/images/linkedin-jobs-search-logo.svg',
  },
};

// 主题初始化脚本 - 防止闪烁
const themeInitScript = `
(function() {
  try {
    const root = document.documentElement;
    const config = ${JSON.stringify({
      brand: style.brand,
      accent: style.accent,
      neutral: style.neutral,
      solid: style.solid,
      'solid-style': style.solidStyle,
      border: style.border,
      surface: style.surface,
      transition: style.transition,
      scaling: style.scaling,
      'viz-style': dataStyle.variant,
    })};

    Object.entries(config).forEach(([key, value]) => {
      root.setAttribute('data-' + key, value);
    });

    const resolveTheme = (themeValue) => {
      if (!themeValue || themeValue === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return themeValue;
    };

    const savedTheme = localStorage.getItem('data-theme');
    const resolvedTheme = resolveTheme(savedTheme);
    root.setAttribute('data-theme', resolvedTheme);

    const styleKeys = Object.keys(config);
    styleKeys.forEach(key => {
      const value = localStorage.getItem('data-' + key);
      if (value) {
        root.setAttribute('data-' + key, value);
      }
    });
  } catch (e) {
    console.error('Failed to initialize theme:', e);
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <StackProvider>
          <Providers>
            {/* 使用Column作为body容器 - 参考chanmeng项目 */}
            <Column
              background="page"
              fillWidth
              style={{ minHeight: '100vh' }}
              horizontal="center"
            >
              {/* 全局背景效果 */}
              <Background
                position="fixed"
                mask={{
                  x: effects.mask.x,
                  y: effects.mask.y,
                  radius: effects.mask.radius,
                  cursor: effects.mask.cursor,
                }}
                gradient={{
                  display: effects.gradient.display,
                  opacity: effects.gradient.opacity as opacity,
                  x: effects.gradient.x,
                  y: effects.gradient.y,
                  width: effects.gradient.width,
                  height: effects.gradient.height,
                  tilt: effects.gradient.tilt,
                  colorStart: effects.gradient.colorStart,
                  colorEnd: effects.gradient.colorEnd,
                }}
                dots={{
                  display: effects.dots.display,
                  opacity: effects.dots.opacity as opacity,
                  size: effects.dots.size as SpacingToken,
                  color: effects.dots.color,
                }}
                grid={{
                  display: effects.grid.display,
                  opacity: effects.grid.opacity as opacity,
                  color: effects.grid.color,
                  width: effects.grid.width,
                  height: effects.grid.height,
                }}
                lines={{
                  display: effects.lines.display,
                  opacity: effects.lines.opacity as opacity,
                  size: effects.lines.size as SpacingToken,
                  thickness: effects.lines.thickness,
                  angle: effects.lines.angle,
                  color: effects.lines.color,
                }}
              />

              {/* 导航栏上方间距 - 仅桌面显示 */}
              <Flex fillWidth minHeight="16" className="s-flex-hide" />

              {/* 导航栏 - 包装在Suspense中以支持useUser hook */}
              <Suspense fallback={<NavigationSkeleton />}>
                <Navigation />
              </Suspense>

              {/* 主内容区 */}
              <Flex
                zIndex={0}
                fillWidth
                padding="l"
                horizontal="center"
                flex={1}
              >
                <Flex horizontal="center" fillWidth minHeight="0">
                  {children}
                </Flex>
              </Flex>

              {/* 页脚 */}
              <Footer />
            </Column>
          </Providers>
        </StackProvider>
      </body>
    </html>
  );
}
