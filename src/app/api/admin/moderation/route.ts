import { NextRequest, NextResponse } from 'next/server';

interface Report {
  id: string;
  type: 'post' | 'comment' | 'user' | 'product';
  contentId: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  content: {
    title?: string;
    text?: string;
    author: string;
    image?: string;
  };
}

// In-memory report storage for demo
const reports = new Map<string, Report>();

// Initialize with mock data
const initMockReports = () => {
  if (reports.size === 0) {
    const mockReports: Report[] = [
      {
        id: '1',
        type: 'post',
        contentId: 'post-123',
        reportedBy: 'user@example.com',
        reason: 'Spam',
        description: 'This post contains spam links to external websites selling unverified products.',
        status: 'pending',
        createdAt: '2025-01-20T10:30:00Z',
        content: {
          title: 'Amazing Raw Food Deals!',
          text: 'Check out these incredible deals on raw dog food! Click here for 50% off...',
          author: 'spammer123',
          image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'
        }
      },
      {
        id: '2',
        type: 'comment',
        contentId: 'comment-456',
        reportedBy: 'moderator@rawgle.com',
        reason: 'Harassment',
        description: 'User is harassing another member with personal attacks.',
        status: 'pending',
        createdAt: '2025-01-20T09:15:00Z',
        content: {
          text: 'You clearly have no idea what you\'re talking about. Stop giving bad advice!',
          author: 'angrydogowner',
        }
      },
      {
        id: '3',
        type: 'user',
        contentId: 'user-789',
        reportedBy: 'community@rawgle.com',
        reason: 'Fake Profile',
        description: 'User profile appears to be fake, using stock photos and impersonating a vet.',
        status: 'pending',
        createdAt: '2025-01-20T08:45:00Z',
        content: {
          text: 'Profile claims to be Dr. Sarah Johnson, DVM, but uses stock photos and has no verifiable credentials.',
          author: 'fakevet99',
        }
      },
      {
        id: '4',
        type: 'product',
        contentId: 'product-321',
        reportedBy: 'supplier@rawgle.com',
        reason: 'Misleading Information',
        description: 'Product description contains false health claims.',
        status: 'pending',
        createdAt: '2025-01-19T16:20:00Z',
        content: {
          title: 'Miracle Raw Food - Cures All Diseases',
          text: 'This raw food formula will cure cancer, diabetes, and all other diseases in your dog!',
          author: 'shadysupplier',
          image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'
        }
      },
      {
        id: '5',
        type: 'post',
        contentId: 'post-654',
        reportedBy: 'user2@example.com',
        reason: 'Inappropriate Content',
        description: 'Post contains graphic images not suitable for general audience.',
        status: 'pending',
        createdAt: '2025-01-19T14:10:00Z',
        content: {
          title: 'Raw Feeding Process',
          text: 'Here are some photos of how I prepare raw food for my dogs...',
          author: 'rawfoodlover',
          image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400'
        }
      },
      {
        id: '6',
        type: 'comment',
        contentId: 'comment-987',
        reportedBy: 'admin@rawgle.com',
        reason: 'Off-topic',
        description: 'Comment is completely unrelated to the discussion.',
        status: 'approved',
        createdAt: '2025-01-18T11:30:00Z',
        content: {
          text: 'Anyone want to buy my used car? Great deal!',
          author: 'offtopicuser',
        }
      },
      {
        id: '7',
        type: 'post',
        contentId: 'post-147',
        reportedBy: 'user3@example.com',
        reason: 'Misinformation',
        description: 'Post spreads false veterinary advice that could harm pets.',
        status: 'approved',
        createdAt: '2025-01-17T09:45:00Z',
        content: {
          title: 'Why You Should Never Visit a Vet',
          text: 'Vets are just trying to take your money. Raw food cures everything, you never need a vet!',
          author: 'antivetuser',
        }
      },
      {
        id: '8',
        type: 'user',
        contentId: 'user-258',
        reportedBy: 'moderator@rawgle.com',
        reason: 'Suspicious Activity',
        description: 'User appears to be a bot, posting identical messages across multiple threads.',
        status: 'rejected',
        createdAt: '2025-01-16T15:20:00Z',
        content: {
          text: 'User has posted "Great post! Check out my profile for raw food tips!" 50+ times.',
          author: 'botaccount',
        }
      },
      {
        id: '9',
        type: 'product',
        contentId: 'product-852',
        reportedBy: 'quality@rawgle.com',
        reason: 'Quality Concerns',
        description: 'Multiple users reported getting sick dogs after using this product.',
        status: 'rejected',
        createdAt: '2025-01-15T12:00:00Z',
        content: {
          title: 'Budget Raw Dog Food Mix',
          text: 'Cheap raw food alternative for budget-conscious pet owners.',
          author: 'budgetsupplier',
        }
      },
    ];

    mockReports.forEach(report => reports.set(report.id, report));
  }
};

export async function GET(req: NextRequest) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    initMockReports();

    return NextResponse.json({
      success: true,
      reports: Array.from(reports.values())
    });

  } catch (error) {
    console.error('Admin moderation fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    initMockReports();

    const body = await req.json();
    const { reportId, action } = body;

    if (!reportId || !action) {
      return NextResponse.json(
        { success: false, error: 'Report ID and action are required' },
        { status: 400 }
      );
    }

    const report = reports.get(reportId);
    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Update report status
    if (action === 'approve') {
      report.status = 'approved';
      // In production: Also take action on the content (remove, hide, etc.)
    } else if (action === 'reject') {
      report.status = 'rejected';
    }

    reports.set(reportId, report);

    return NextResponse.json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Admin moderation update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check admin authorization
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    initMockReports();

    const body = await req.json();
    const { type, contentId, reportedBy, reason, description, content } = body;

    if (!type || !contentId || !reportedBy || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newReport: Report = {
      id: Date.now().toString(),
      type,
      contentId,
      reportedBy,
      reason,
      description: description || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      content: content || { text: '', author: '' }
    };

    reports.set(newReport.id, newReport);

    return NextResponse.json({
      success: true,
      report: newReport
    });

  } catch (error) {
    console.error('Admin moderation create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
