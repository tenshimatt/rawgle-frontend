import { MainNav } from '@/components/navigation/main-nav';
import { Card } from '@/components/ui/card';

export default function FAQPage() {
  const faqs = [
    { q: 'What is raw feeding?', a: 'Raw feeding is a diet consisting of uncooked meats, bones, organs, and sometimes vegetables that mimics what animals would eat in nature.' },
    { q: 'Is raw feeding safe?', a: 'Yes, when done properly with safe food handling practices. Our guides cover everything you need to know.' },
    { q: 'How do I get started?', a: 'Start by creating an account, adding your pet, and exploring our beginner guides and community recipes.' },
    { q: 'What are PAWS tokens?', a: 'PAWS tokens are rewards you earn by engaging with the platform, sharing knowledge, and achieving milestones.' },
  ];

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          <h1 className="hero-title">Frequently Asked Questions</h1>
          <div className="space-y-4 mt-8">
            {faqs.map((faq, i) => (
              <Card key={i} className="card-feature-primary p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-900">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
