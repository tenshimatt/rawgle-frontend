'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // TODO: Implement actual contact form API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen page-gradient">
      
      <div className="container-page">
        <div className="max-w-2xl mx-auto">
          <h1 className="hero-title">Contact Us</h1>
          <p className="hero-description mb-8">We'd love to hear from you</p>
          <Card className="card-feature-primary">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label className="label-base">Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-base" required disabled={submitting} /></div>
                <div><Label className="label-base">Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-base" required disabled={submitting} /></div>
                <div><Label className="label-base">Message</Label><Textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="input-base min-h-[120px]" required disabled={submitting} /></div>
                <Button type="submit" variant="default" disabled={submitting}>{submitting ? 'Sending...' : 'Send Message'}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
