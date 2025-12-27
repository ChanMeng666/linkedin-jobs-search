import Link from 'next/link';
import { Column, Heading, Text } from '@once-ui-system/core';

export const metadata = {
  title: 'Terms of Service | JobSearch',
  description: 'Terms of Service for JobSearch - LinkedIn job search platform',
};

export default function TermsPage() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="xl" fillWidth style={{ margin: '0 auto' }}>
      <Column gap="16">
        <Link href="/" className="text-sm text-stone-500 hover:text-stone-700">
          &larr; Back to Home
        </Link>
        <Heading variant="display-strong-l">Terms of Service</Heading>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Last updated: December 2024
        </Text>
      </Column>

      <Column gap="32">
        <Section title="1. Acceptance of Terms">
          <Text variant="body-default-m" onBackground="neutral-medium">
            By accessing or using JobSearch, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our service.
          </Text>
        </Section>

        <Section title="2. Description of Service">
          <Text variant="body-default-m" onBackground="neutral-medium">
            JobSearch is a job search platform that aggregates job listings from LinkedIn.
            We provide tools to search, save, and organize job opportunities. The service
            is provided &quot;as is&quot; without warranties of any kind.
          </Text>
        </Section>

        <Section title="3. User Accounts">
          <Text variant="body-default-m" onBackground="neutral-medium">
            To access certain features, you must create an account. You are responsible for
            maintaining the confidentiality of your account credentials and for all activities
            under your account. You must provide accurate and complete information when
            creating your account.
          </Text>
        </Section>

        <Section title="4. Acceptable Use">
          <Text variant="body-default-m" onBackground="neutral-medium">
            You agree not to: (a) use the service for any unlawful purpose; (b) attempt to
            gain unauthorized access to any part of the service; (c) interfere with or disrupt
            the service; (d) use automated means to access the service beyond normal API usage;
            (e) resell or redistribute the service without authorization.
          </Text>
        </Section>

        <Section title="5. Intellectual Property">
          <Text variant="body-default-m" onBackground="neutral-medium">
            The service and its original content, features, and functionality are owned by
            JobSearch and are protected by international copyright, trademark, and other
            intellectual property laws. Job listing data is sourced from LinkedIn and remains
            the property of their respective owners.
          </Text>
        </Section>

        <Section title="6. Data and Privacy">
          <Text variant="body-default-m" onBackground="neutral-medium">
            Your use of the service is also governed by our{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            By using the service, you consent to our collection and use of data as described
            in the Privacy Policy.
          </Text>
        </Section>

        <Section title="7. Third-Party Services">
          <Text variant="body-default-m" onBackground="neutral-medium">
            Our service integrates with third-party services including LinkedIn for job data
            and authentication providers (Google, GitHub). Your use of these services is
            subject to their respective terms and policies.
          </Text>
        </Section>

        <Section title="8. Limitation of Liability">
          <Text variant="body-default-m" onBackground="neutral-medium">
            JobSearch shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages resulting from your use of the service. We do not guarantee
            the accuracy, completeness, or timeliness of job listings.
          </Text>
        </Section>

        <Section title="9. Changes to Terms">
          <Text variant="body-default-m" onBackground="neutral-medium">
            We reserve the right to modify these terms at any time. We will notify users of
            significant changes via email or through the service. Continued use of the service
            after changes constitutes acceptance of the new terms.
          </Text>
        </Section>

        <Section title="10. Contact">
          <Text variant="body-default-m" onBackground="neutral-medium">
            For questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:chanmeng.dev@gmail.com" className="text-blue-600 hover:underline">
              chanmeng.dev@gmail.com
            </a>.
          </Text>
        </Section>
      </Column>
    </Column>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Column gap="12">
      <Heading variant="heading-strong-m">{title}</Heading>
      {children}
    </Column>
  );
}
