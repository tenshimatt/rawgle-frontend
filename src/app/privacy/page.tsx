
export default function PrivacyPage() {
  return (
    <div className="min-h-screen page-gradient">
      
      <div className="container-page max-w-4xl mx-auto prose prose-gray">
        <h1>Privacy Policy</h1>
        <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
        <h2>Data Collection</h2>
        <p>We collect information you provide when creating an account and using our services, including pet health data, feeding schedules, and activity logs.</p>
        <h2>Data Usage</h2>
        <p>Your data is used to provide personalized features, improve our services, and connect you with the community. We never sell your personal information.</p>
        <h2>Data Security</h2>
        <p>We implement industry-standard security measures to protect your data, including encryption and secure cloud storage.</p>
      </div>
    </div>
  );
}
