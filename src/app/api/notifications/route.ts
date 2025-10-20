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

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const userNotifications = notifications.filter(n => n.userId === userId);
  return NextResponse.json({ data: userNotifications });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, title, message } = body;
  const userId = request.headers.get('x-user-id');

  if (!type || !title || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newNotification = {
    id: Date.now().toString(),
    userId: userId || 'anonymous',
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
  };

  notifications.unshift(newNotification);
  return NextResponse.json({ data: newNotification }, { status: 201 });
}
