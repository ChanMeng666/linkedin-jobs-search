import Link from 'next/link';
import { Column, Heading, Text } from '@once-ui-system/core';

export const metadata = {
  title: 'Privacy Policy | JobSearch',
  description: 'Privacy Policy for JobSearch - How we collect, use, and protect your data',
};

export default function PrivacyPage() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="xl" fillWidth style={{ margin: '0 auto' }}>
      <Column gap="16">
        <Link href="/" className="text-sm text-stone-500 hover:text-stone-700">
          &larr; Back to Home
        </Link>
        <Heading variant="display-strong-l">Privacy Policy</Heading>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Last updated: December 2024
        </Text>
      </Column>

      <Column gap="32">
        <Section title="1. Information We Collect">
          <Text variant="body-default-m" onBackground="neutral-medium">
            We collect information you provide directly: email address, display name, and
            profile information from OAuth providers (Google, GitHub). We also collect usage
            data including search queries, saved jobs, and interaction patterns to improve
            the service.
          </Text>
        </Section>

        <Section title="2. How We Use Your Information">
          <Text variant="body-default-m" onBackground="neutral-medium">
            We use your information to: (a) provide and maintain the service; (b) personalize
            your experience; (c) save your job searches and preferences; (d) send service-related
            communications; (e) analyze usage patterns to improve the service; (f) protect
            against unauthorized access and abuse.
          </Text>
        </Section>

        <Section title="3. Data Storage">
          <Text variant="body-default-m" onBackground="neutral-medium">
            Your data is stored securely using Neon PostgreSQL database with encryption at rest.
            We retain your data for as long as your account is active. You can request deletion
            of your account and associated data at any time.
          </Text>
        </Section>

        <Section title="4. Third-Party Services">
          <Text variant="body-default-m" onBackground="neutral-medium">
            We use the following third-party services:
          </Text>
          <Column gap="8" paddingLeft="16">
            <Text variant="body-default-m" onBackground="neutral-medium">
              - <strong>Stack Auth</strong>: For authentication and user management
            </Text>
            <Text variant="body-default-m" onBackground="neutral-medium">
              - <strong>LinkedIn</strong>: For job listing data (via public API)
            </Text>
            <Text variant="body-default-m" onBackground="neutral-medium">
              - <strong>Vercel</strong>: For hosting and analytics
            </Text>
            <Text variant="body-default-m" onBackground="neutral-medium">
              - <strong>Neon</strong>: For database hosting
            </Text>
          </Column>
        </Section>

        <Section title="5. Cookies and Tracking">
          <Text variant="body-default-m" onBackground="neutral-medium">
            We use essential cookies for authentication and session management. We may use
            analytics cookies to understand how visitors interact with the service. You can
            control cookie preferences through your browser settings.
          </Text>
        </Section>

        <Section title="6. Data Sharing">
          <Text variant="body-default-m" onBackground="neutral-medium">
            We do not sell your personal information. We may share data with: (a) service
            providers who assist in operating our service; (b) law enforcement when required
            by law; (c) other parties with your explicit consent.
          </Text>
        </Section>

        <Section title="7. Your Rights">
          <Text variant="body-default-m" onBackground="neutral-medium">
            You have the right to: (a) access your personal data; (b) correct inaccurate data;
            (c) request deletion of your data; (d) export your data; (e) opt out of marketing
            communications. Contact us to exercise these rights.
          </Text>
        </Section>

        <Section title="8. Security">
          <Text variant="body-default-m" onBackground="neutral-medium">
            We implement industry-standard security measures including HTTPS encryption,
            secure authentication, and regular security audits. However, no method of
            transmission over the Internet is 100% secure.
          </Text>
        </Section>

        <Section title="9. Children&apos;s Privacy">
          <Text variant="body-default-m" onBackground="neutral-medium">
            Our service is not intended for children under 16. We do not knowingly collect
            personal information from children. If you believe a child has provided us with
            personal information, please contact us.
          </Text>
        </Section>

        <Section title="10. Changes to This Policy">
          <Text variant="body-default-m" onBackground="neutral-medium">
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new policy on this page and updating the &quot;Last updated&quot;
            date.
          </Text>
        </Section>

        <Section title="11. Contact Us">
          <Text variant="body-default-m" onBackground="neutral-medium">
            If you have questions about this Privacy Policy or our data practices, please
            contact us at{' '}
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
