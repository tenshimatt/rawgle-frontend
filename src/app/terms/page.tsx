
export default function TermsPage() {
  return (
    <div className="min-h-screen page-gradient">
      
      <div className="container-page max-w-4xl mx-auto prose prose-gray">
        <h1>Terms of Service</h1>
        <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
        <h2>Acceptance of Terms</h2>
        <p>By accessing Rawgle, you agree to these terms. Please read them carefully.</p>
        <h2>Use of Service</h2>
        <p>You may use Rawgle for lawful purposes only. You are responsible for maintaining the security of your account.</p>
        <h2>Content</h2>
        <p>You retain ownership of content you post. By posting, you grant us a license to use, display, and distribute your content within the platform.</p>
        <h2>Disclaimer</h2>
        <p>Rawgle provides educational information. Always consult your veterinarian for medical advice.</p>
      </div>
    </div>
  );
}
