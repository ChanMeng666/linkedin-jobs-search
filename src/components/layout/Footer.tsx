import Link from 'next/link';
import Image from 'next/image';
import { Column, Flex, Text, Heading, Line, Button } from '@once-ui-system/core';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      as="footer"
      fillWidth
      padding="xl"
      horizontal="center"
      background="neutral-strong"
    >
      <Column maxWidth="l" fillWidth gap="48">
        {/* Top Section */}
        <Flex gap="48" mobileDirection="column" fillWidth>
          {/* Brand Column */}
          <Column flex={2} gap="16">
            <Flex gap="8" vertical="center">
              <Image
                src="/assets/images/linkedin-jobs-search-logo.svg"
                alt="JobSearch Logo"
                width={40}
                height={40}
              />
              <Text variant="heading-strong-m" onSolid="neutral-strong">
                JobSearch
              </Text>
            </Flex>
            <Text variant="body-default-s" onSolid="neutral-medium" style={{ maxWidth: 300 }}>
              Professional job discovery platform with advanced filtering and real-time LinkedIn integration.
            </Text>
            {/* Social Links */}
            <Flex gap="16" paddingTop="8">
              <a
                href="https://github.com/ChanMeng666/linkedin-jobs-search"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--neutral-on-solid-medium)' }}
                className="card-interactive"
              >
                <svg style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://twitter.com/ChanMeng666"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--neutral-on-solid-medium)' }}
                className="card-interactive"
              >
                <svg style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="mailto:chanmeng.dev@gmail.com"
                style={{ color: 'var(--neutral-on-solid-medium)' }}
                className="card-interactive"
              >
                <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </Flex>
          </Column>

          {/* Links Grid */}
          <Flex flex={3} gap="32" wrap>
            {/* Product */}
            <Column gap="16" style={{ minWidth: 120 }}>
              <Text variant="label-strong-s" onSolid="neutral-strong">Product</Text>
              <Column gap="12">
                <Link href="/search" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">Job Search</Text>
                </Link>
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">Dashboard</Text>
                </Link>
                <Link href="/api-docs" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">API Access</Text>
                </Link>
                <Link href="/pricing" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">Pricing</Text>
                </Link>
              </Column>
            </Column>

            {/* Company */}
            <Column gap="16" style={{ minWidth: 120 }}>
              <Text variant="label-strong-s" onSolid="neutral-strong">Company</Text>
              <Column gap="12">
                <Link href="/#about" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">About</Text>
                </Link>
                <a href="https://github.com/ChanMeng666" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">Blog</Text>
                </a>
                <a href="mailto:chanmeng.dev@gmail.com" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">Contact</Text>
                </a>
              </Column>
            </Column>

            {/* Resources */}
            <Column gap="16" style={{ minWidth: 120 }}>
              <Text variant="label-strong-s" onSolid="neutral-strong">Resources</Text>
              <Column gap="12">
                <Link href="/api-docs" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">Documentation</Text>
                </Link>
                <Link href="/api-docs#examples" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">Code Examples</Text>
                </Link>
                <Link href="/#faq" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">FAQ</Text>
                </Link>
                <a href="https://github.com/ChanMeng666/linkedin-jobs-search" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">GitHub</Text>
                </a>
              </Column>
            </Column>

            {/* Legal */}
            <Column gap="16" style={{ minWidth: 120 }}>
              <Text variant="label-strong-s" onSolid="neutral-strong">Legal</Text>
              <Column gap="12">
                <Link href="#" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">Terms of Service</Text>
                </Link>
                <Link href="#" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">Privacy Policy</Text>
                </Link>
                <Link href="#" style={{ textDecoration: 'none' }}>
                  <Text variant="body-default-s" onSolid="neutral-medium" className="card-interactive">Cookie Policy</Text>
                </Link>
              </Column>
            </Column>
          </Flex>
        </Flex>

        {/* Divider */}
        <Line background="neutral-alpha-weak" />

        {/* Bottom Section */}
        <Flex horizontal="between" vertical="center" mobileDirection="column" gap="16">
          <Flex gap="16" vertical="center" wrap>
            <Text variant="body-default-s" onSolid="neutral-medium">
              © {currentYear} JobSearch. All rights reserved.
            </Text>
            <Flex gap="8" vertical="center">
              <Image
                src="/assets/images/chan_logo.svg"
                alt="Chan Meng"
                width={20}
                height={20}
                style={{ borderRadius: '50%' }}
              />
              <Text variant="body-default-s" onSolid="neutral-medium">
                Built by <strong style={{ color: 'var(--neutral-on-solid-strong)' }}>Chan Meng</strong>
              </Text>
            </Flex>
          </Flex>

          <a
            href="mailto:chanmeng.dev@gmail.com?subject=Custom%20Website%20Development%20Inquiry"
            style={{ textDecoration: 'none' }}
          >
            <Button variant="primary" size="s">
              Need a custom solution? Let&apos;s talk!
            </Button>
          </a>
        </Flex>
      </Column>
    </Flex>
  );
}
