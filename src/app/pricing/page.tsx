import Link from 'next/link';
import { Column, Flex, Heading, Text, Button, Badge } from '@once-ui-system/core';

export default function PricingPage() {
  return (
    <Column maxWidth="l" gap="xl" paddingY="xl" fillWidth>
      {/* Header */}
      <Column gap="16" horizontal="center">
        <Heading variant="display-strong-l" align="center">
          Simple, Transparent Pricing
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak" align="center" style={{ maxWidth: 600 }}>
          Start for free. Upgrade when you need more power.
        </Text>
      </Column>

      {/* Pricing Cards */}
      <Flex gap="24" wrap horizontal="center" fillWidth>
        {/* Free Plan */}
        <Column
          padding="32"
          gap="24"
          radius="l"
          border="neutral-alpha-weak"
          background="surface"
          className="glass-card"
          style={{ flex: '1 1 300px', maxWidth: 360 }}
        >
          <Column gap="8">
            <Text variant="heading-strong-m">Free</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">Perfect for getting started</Text>
          </Column>
          <Flex gap="4" vertical="end">
            <Text variant="display-strong-l">$0</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">/month</Text>
          </Flex>
          <Column gap="12">
            <PricingFeature included>Basic job search</PricingFeature>
            <PricingFeature included>Save up to 10 jobs</PricingFeature>
            <PricingFeature included>Search history (7 days)</PricingFeature>
            <PricingFeature included>Single country search</PricingFeature>
            <PricingFeature>Multi-country search</PricingFeature>
            <PricingFeature>Export to CSV/Excel</PricingFeature>
            <PricingFeature>API access</PricingFeature>
          </Column>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="l" fillWidth>
              Get Started
            </Button>
          </Link>
        </Column>

        {/* Pro Plan */}
        <Column
          padding="32"
          gap="24"
          radius="l"
          border="brand-strong"
          background="surface"
          className="glass-card"
          style={{ flex: '1 1 300px', maxWidth: 360, position: 'relative' }}
        >
          <Badge
            style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            Most Popular
          </Badge>
          <Column gap="8">
            <Text variant="heading-strong-m">Pro</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">For serious job seekers</Text>
          </Column>
          <Flex gap="4" vertical="end">
            <Text variant="display-strong-l">$9</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">/month</Text>
          </Flex>
          <Column gap="12">
            <PricingFeature included>Everything in Free</PricingFeature>
            <PricingFeature included>Unlimited saved jobs</PricingFeature>
            <PricingFeature included>Full search history</PricingFeature>
            <PricingFeature included>Multi-country search</PricingFeature>
            <PricingFeature included>Export to CSV/Excel</PricingFeature>
            <PricingFeature included>Priority support</PricingFeature>
            <PricingFeature>API access</PricingFeature>
          </Column>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="l" fillWidth>
              Start Free Trial
            </Button>
          </Link>
        </Column>

        {/* Enterprise Plan */}
        <Column
          padding="32"
          gap="24"
          radius="l"
          border="neutral-alpha-weak"
          background="surface"
          className="glass-card"
          style={{ flex: '1 1 300px', maxWidth: 360 }}
        >
          <Column gap="8">
            <Text variant="heading-strong-m">Enterprise</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">For teams and developers</Text>
          </Column>
          <Flex gap="4" vertical="end">
            <Text variant="display-strong-l">$49</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">/month</Text>
          </Flex>
          <Column gap="12">
            <PricingFeature included>Everything in Pro</PricingFeature>
            <PricingFeature included>Full API access</PricingFeature>
            <PricingFeature included>Unlimited API calls</PricingFeature>
            <PricingFeature included>Team accounts</PricingFeature>
            <PricingFeature included>Custom integrations</PricingFeature>
            <PricingFeature included>Dedicated support</PricingFeature>
            <PricingFeature included>SLA guarantee</PricingFeature>
          </Column>
          <a href="mailto:chanmeng.dev@gmail.com" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="l" fillWidth>
              Contact Sales
            </Button>
          </a>
        </Column>
      </Flex>

      {/* FAQ */}
      <Column gap="32" paddingTop="48" maxWidth="m" style={{ margin: '0 auto' }}>
        <Heading variant="heading-strong-l" align="center">
          Frequently Asked Questions
        </Heading>
        <Column gap="16">
          <FAQItem
            question="Is the free plan really free?"
            answer="Yes! The free plan includes all basic features with no credit card required. You can use it indefinitely."
          />
          <FAQItem
            question="Can I cancel anytime?"
            answer="Absolutely. You can upgrade, downgrade, or cancel your subscription at any time with no penalties."
          />
          <FAQItem
            question="What payment methods do you accept?"
            answer="We accept all major credit cards, PayPal, and bank transfers for enterprise plans."
          />
          <FAQItem
            question="Do you offer refunds?"
            answer="Yes, we offer a 14-day money-back guarantee. If you're not satisfied, contact us for a full refund."
          />
        </Column>
      </Column>
    </Column>
  );
}

function PricingFeature({ children, included = false }: { children: React.ReactNode; included?: boolean }) {
  return (
    <Flex gap="8" vertical="center">
      {included ? (
        <svg style={{ width: 20, height: 20, color: 'var(--success-on-background-strong)', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg style={{ width: 20, height: 20, color: 'var(--neutral-alpha-medium)', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <Text
        variant="body-default-s"
        onBackground={included ? 'neutral-strong' : 'neutral-weak'}
      >
        {children}
      </Text>
    </Flex>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <Column
      padding="20"
      gap="8"
      radius="l"
      border="neutral-alpha-weak"
      background="surface"
      className="glass-card"
    >
      <Text variant="heading-strong-s">{question}</Text>
      <Text variant="body-default-s" onBackground="neutral-weak">{answer}</Text>
    </Column>
  );
}
