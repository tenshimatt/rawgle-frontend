import { MainNav } from '@/components/navigation/main-nav';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen page-gradient">
      <MainNav />
      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          <h1 className="hero-title">About Rawgle</h1>
          <p className="hero-description mb-8">Revolutionizing pet health through raw feeding</p>

          <Card className="card-feature-primary p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-900">Rawgle is dedicated to helping pet owners provide the healthiest, most natural diet for their furry companions through raw feeding education, community support, and innovative tools.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Raw Feeding?</h2>
              <p className="text-gray-900">Raw feeding aligns with pets' biological needs, providing optimal nutrition through whole, unprocessed foods. Our platform makes it easy to track, learn, and connect with others on the same journey.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">What We Offer</h2>
              <ul className="list-disc list-inside text-gray-900 space-y-2">
                <li>Comprehensive pet health tracking</li>
                <li>Feeding schedule management</li>
                <li>Community support & recipe sharing</li>
                <li>AI-powered nutrition guidance</li>
                <li>Educational resources</li>
                <li>PAWS token rewards ecosystem</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
