'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MainNav } from '@/components/navigation/main-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Dog } from 'lucide-react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Registration failed');

      window.location.href = '/auth/login';
    } catch (error) {
      alert('Registration failed');
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
            <Dog className="h-16 w-16 mx-auto mb-4 text-persian-green" />
            <h1 className="hero-title">Join Rawgle</h1>
            <p className="hero-description">Create your account to get started</p>
          </div>

          <Card className="card-feature-primary">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="label-base">Full Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-base" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="label-base">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-base" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="label-base">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-base" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="label-base">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="input-base" required />
                </div>
                <Button type="submit" className="w-full btn-primary" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating account...</> : 'Create Account'}
                </Button>
                <div className="text-center text-sm text-muted">
                  Already have an account? <Link href="/auth/login" className="text-persian-green hover:underline font-semibold">Sign in</Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
