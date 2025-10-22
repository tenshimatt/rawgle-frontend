'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Mail, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ShareButtonProps {
  itemId: string;
  itemType: 'post' | 'recipe';
  title: string;
  description?: string;
  url?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function ShareButton({
  itemId,
  itemType,
  title,
  description = '',
  url,
  size = 'md',
  showText = false,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || `${window.location.origin}/community/${itemType}s/${itemId}`;
  const shareText = `Check out this ${itemType}: ${title}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      setOpen(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(`${description}\n\n${shareUrl}`)}`;
    window.location.href = emailUrl;
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNativeShare}
          className="flex items-center gap-2 text-muted hover:text-persian-green transition-colors hover:bg-transparent"
        >
          <Share2 className={sizeClasses[size]} />
          {showText && <span className={textSize[size]}>Share</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-charcoal">Share {itemType}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {/* Copy Link */}
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full justify-start btn-outline"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-3 text-persian-green" />
                <span>Copied to clipboard!</span>
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-3" />
                <span>Copy link</span>
              </>
            )}
          </Button>

          {/* Share to Twitter */}
          <Button
            onClick={shareToTwitter}
            variant="outline"
            className="w-full justify-start btn-outline"
          >
            <Twitter className="h-4 w-4 mr-3" />
            <span>Share on Twitter</span>
          </Button>

          {/* Share to Facebook */}
          <Button
            onClick={shareToFacebook}
            variant="outline"
            className="w-full justify-start btn-outline"
          >
            <Facebook className="h-4 w-4 mr-3" />
            <span>Share on Facebook</span>
          </Button>

          {/* Share via Email */}
          <Button
            onClick={shareViaEmail}
            variant="outline"
            className="w-full justify-start btn-outline"
          >
            <Mail className="h-4 w-4 mr-3" />
            <span>Share via Email</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
