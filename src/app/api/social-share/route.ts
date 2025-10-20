import { NextRequest, NextResponse } from 'next/server';

// Feature 40: Social sharing for posts
export async function POST(request: NextRequest) {
  const { postId, platform } = await request.json();

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=https://rawgle.com/posts/${postId}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=https://rawgle.com/posts/${postId}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://rawgle.com/posts/${postId}`,
  };

  return NextResponse.json({ data: { shareUrl: shareUrls[platform as keyof typeof shareUrls] } });
}
