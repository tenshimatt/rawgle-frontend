'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MainNav } from '@/components/navigation/main-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (error) {
      alert('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />
      <div className="container-page">
        <div className="max-w-md mx-auto pt-20">
          <div className="text-center mb-8">
            <Mail className="h-16 w-16 mx-auto mb-4 text-persian-green" />
            <h1 className="hero-title">Reset Password</h1>
            <p className="hero-description">Enter your email to receive reset instructions</p>
          </div>

          <Card className="card-feature-primary">
            <CardContent className="pt-6">
              {sent ? (
                <div className="text-center space-y-4">
                  <p className="text-charcoal">Check your email for reset instructions</p>
                  <Link href="/auth/login" className="btn-primary inline-block">Back to Login</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="label-base">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" required />
                  </div>
                  <Button type="submit" className="w-full btn-primary" disabled={loading}>
                    {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</> : 'Send Reset Link'}
                  </Button>
                  <div className="text-center text-sm text-muted">
                    Remember your password? <Link href="/auth/login" className="text-persian-green hover:underline">Sign in</Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
