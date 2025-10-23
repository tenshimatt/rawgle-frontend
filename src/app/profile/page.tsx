'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Bell, Shield, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Demo User',
    email: 'demo@rawgle.com',
    notifications: {
      feeding: true,
      health: true,
      community: false,
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setChangingPassword(true);
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen page-gradient">
      <div className="container-page max-w-4xl">
        <h1 className="hero-title">Profile & Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Profile Information */}
          <Card className="card-feature-primary">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 icon-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="label-base">Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="input-base"
                />
              </div>
              <div>
                <Label className="label-base">Email</Label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="input-base"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="card-feature-secondary">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5 icon-secondary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-900">Feeding Reminders</Label>
                <input
                  type="checkbox"
                  checked={profile.notifications.feeding}
                  onChange={(e) => setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, feeding: e.target.checked }
                  })}
                  className="h-5 w-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-gray-900">Health Alerts</Label>
                <input
                  type="checkbox"
                  checked={profile.notifications.health}
                  onChange={(e) => setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, health: e.target.checked }
                  })}
                  className="h-5 w-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-gray-900">Community Updates</Label>
                <input
                  type="checkbox"
                  checked={profile.notifications.community}
                  onChange={(e) => setProfile({
                    ...profile,
                    notifications: { ...profile.notifications, community: e.target.checked }
                  })}
                  className="h-5 w-5"
                />
              </div>
            </CardContent>
          </Card>
          {/* Security/Password */}
          <Card className="card-feature-primary">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Lock className="h-5 w-5 icon-primary" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="label-base">Current Password</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="input-base"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <Label className="label-base">New Password</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input-base"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <Label className="label-base">Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input-base"
                  placeholder="Confirm new password"
                />
              </div>
              <Button
                variant="outline"
                onClick={handlePasswordChange}
                disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                className="w-full"
              >
                {changingPassword ? 'Changing Password...' : 'Change Password'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button variant="default" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
