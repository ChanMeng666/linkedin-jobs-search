import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Start for free. Upgrade when you need more power.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="card p-8">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">Free</h3>
            <p className="text-stone-500 text-sm mb-6">Perfect for getting started</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-stone-900">$0</span>
              <span className="text-stone-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <PricingFeature included>Basic job search</PricingFeature>
              <PricingFeature included>Save up to 10 jobs</PricingFeature>
              <PricingFeature included>Search history (7 days)</PricingFeature>
              <PricingFeature included>Single country search</PricingFeature>
              <PricingFeature>Multi-country search</PricingFeature>
              <PricingFeature>Export to CSV/Excel</PricingFeature>
              <PricingFeature>API access</PricingFeature>
            </ul>
            <Link href="/login" className="block w-full btn btn-secondary text-center">
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="card p-8 border-2 border-brand-primary relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-primary text-white text-sm font-medium rounded-full">
              Most Popular
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">Pro</h3>
            <p className="text-stone-500 text-sm mb-6">For serious job seekers</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-stone-900">$9</span>
              <span className="text-stone-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <PricingFeature included>Everything in Free</PricingFeature>
              <PricingFeature included>Unlimited saved jobs</PricingFeature>
              <PricingFeature included>Full search history</PricingFeature>
              <PricingFeature included>Multi-country search</PricingFeature>
              <PricingFeature included>Export to CSV/Excel</PricingFeature>
              <PricingFeature included>Priority support</PricingFeature>
              <PricingFeature>API access</PricingFeature>
            </ul>
            <Link href="/login" className="block w-full btn btn-primary text-center">
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="card p-8">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">Enterprise</h3>
            <p className="text-stone-500 text-sm mb-6">For teams and developers</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-stone-900">$49</span>
              <span className="text-stone-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <PricingFeature included>Everything in Pro</PricingFeature>
              <PricingFeature included>Full API access</PricingFeature>
              <PricingFeature included>Unlimited API calls</PricingFeature>
              <PricingFeature included>Team accounts</PricingFeature>
              <PricingFeature included>Custom integrations</PricingFeature>
              <PricingFeature included>Dedicated support</PricingFeature>
              <PricingFeature included>SLA guarantee</PricingFeature>
            </ul>
            <a href="mailto:chanmeng.dev@gmail.com" className="block w-full btn btn-secondary text-center">
              Contact Sales
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingFeature({ children, included = false }: { children: React.ReactNode; included?: boolean }) {
  return (
    <li className={`flex items-center gap-2 text-sm ${included ? 'text-stone-700' : 'text-stone-400'}`}>
      {included ? (
        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-stone-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {children}
    </li>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-stone-900 mb-2">{question}</h3>
      <p className="text-stone-600 text-sm">{answer}</p>
    </div>
  );
}
