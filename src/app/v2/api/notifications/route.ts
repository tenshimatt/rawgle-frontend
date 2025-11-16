import { NextRequest, NextResponse } from 'next/server';

const notifications: any[] = [
  {
    id: '1',
    userId: 'demo-user',
    type: 'feeding',
    title: 'Feeding Reminder',
    message: "It's time to feed Max! Scheduled for 7:00 AM",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '2',
    userId: 'demo-user',
    type: 'health',
    title: 'Vaccination Due',
    message: "Luna's rabies vaccination is due in 7 days",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '3',
    userId: 'demo-user',
    type: 'community',
    title: 'New Comment',
    message: 'Sarah M. commented on your post about puppy training',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

/**
 * GET /v2/api/notifications
 * Get user notifications (bypasses Cloudflare)
 */
export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id') || 'guest';

  const userNotifications = notifications.filter(n => n.userId === userId);
  return NextResponse.json({ success: true, data: userNotifications });
}

/**
 * POST /v2/api/notifications
 * Create a new notification
 */
export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id') || 'guest';

  const body = await request.json();
  const { type, title, message } = body;

  if (!type || !title || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newNotification = {
    id: Date.now().toString(),
    userId,
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
  };

  notifications.unshift(newNotification);
  return NextResponse.json({ success: true, data: newNotification }, { status: 201 });
}
