import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '@/resources/custom.css';
import './globals.css';

import type { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import classNames from 'classnames';

import { Background, Column, Flex, opacity, SpacingToken } from '@once-ui-system/core';
import { StackProvider } from '@/components/providers/StackProvider';
import { Providers } from '@/components/common/Providers';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { fonts, style, effects, dataStyle, home } from '@/resources';

export const dynamic = 'force-dynamic';

function NavigationSkeleton() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '8px',
        zIndex: 9,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '8px',
          borderRadius: '12px',
          border: '1px solid var(--neutral-alpha-weak)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: 40, height: 40, background: 'var(--neutral-alpha-weak)', borderRadius: 8 }} />
          <div style={{ width: 80, height: 20, background: 'var(--neutral-alpha-weak)', borderRadius: 4 }} />
          <div style={{ width: 80, height: 20, background: 'var(--neutral-alpha-weak)', borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: home.title,
  description: home.description,
  icons: {
    icon: '/assets/images/linkedin-jobs-search-logo.svg',
  },
};

// Theme initialization script content
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
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <StackProvider>
          <Providers>
            <Flex
              fillWidth
              direction="column"
              background="page"
              style={{ minHeight: '100vh' }}
              horizontal="center"
            >
              {/* Global Background with Dot Pattern */}
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

              {/* Spacer for fixed navigation */}
              <Flex fillWidth minHeight="16" hide="s" />

              {/* Navigation */}
              <Suspense fallback={<NavigationSkeleton />}>
                <Navigation />
              </Suspense>

              {/* Main Content */}
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

              {/* Footer */}
              <Footer />
            </Flex>
          </Providers>
        </StackProvider>
      </body>
    </html>
  );
}
