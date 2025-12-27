import Link from 'next/link';
import Image from 'next/image';
import { Column, Flex, Text, Line, IconButton } from '@once-ui-system/core';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      as="footer"
      fillWidth
      padding="8"
      horizontal="center"
    >
      <Flex
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        fillWidth
        className="footer-bottom"
      >
        {/* 版权和品牌信息 */}
        <Flex gap="8" vertical="center" wrap>
          <Text variant="body-default-s" onBackground="neutral-weak">
            © {currentYear} JobSearch
          </Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            ·
          </Text>
          <Flex gap="4" vertical="center">
            <Image
              src="/assets/images/chan_logo.svg"
              alt="Chan Meng"
              width={16}
              height={16}
              style={{ borderRadius: '50%' }}
            />
            <Text variant="body-default-s" onBackground="neutral-weak">
              Built by{' '}
              <Link
                href="https://github.com/ChanMeng666"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--brand-on-background-strong)', textDecoration: 'none' }}
              >
                Chan Meng
              </Link>
            </Text>
          </Flex>
        </Flex>

        {/* 社交链接和导航 */}
        <Flex gap="16" vertical="center">
          <Flex gap="8">
            <IconButton
              href="https://github.com/ChanMeng666/linkedin-jobs-search"
              icon="github"
              tooltip="GitHub"
              size="s"
              variant="ghost"
            />
            <IconButton
              href="https://twitter.com/ChanMeng666"
              icon="x"
              tooltip="Twitter"
              size="s"
              variant="ghost"
            />
            <IconButton
              href="mailto:chanmeng.dev@gmail.com"
              icon="email"
              tooltip="Email"
              size="s"
              variant="ghost"
            />
          </Flex>

          <Line background="neutral-alpha-weak" vert maxHeight="16" />

          <Flex gap="12" className="s-flex-hide">
            <Link href="/api-docs" style={{ textDecoration: 'none' }}>
              <Text variant="body-default-s" onBackground="neutral-weak" className="card-interactive">
                API Docs
              </Text>
            </Link>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <Text variant="body-default-s" onBackground="neutral-weak" className="card-interactive">
                Pricing
              </Text>
            </Link>
          </Flex>
        </Flex>
      </Flex>

      {/* 关键: 为移动端底部导航预留空间 */}
      <Flex height="80" className="s-flex-show" />
    </Flex>
  );
}
