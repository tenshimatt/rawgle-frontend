import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ComingSoonProps {
  variant?: 'badge' | 'banner' | 'inline';
  text?: string;
  className?: string;
}

export function ComingSoon({
  variant = 'badge',
  text = 'Coming Soon',
  className
}: ComingSoonProps) {
  if (variant === 'badge') {
    return (
      <Badge
        className={cn(
          "bg-maize/30 text-charcoal border-maize hover:bg-maize/40",
          className
        )}
      >
        <Sparkles className="h-3 w-3 mr-1" />
        {text}
      </Badge>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className={cn(
          "bg-gradient-to-r from-maize/20 to-coral/20 border-l-4 border-maize px-4 py-3 rounded-lg",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-600" />
          <p className="text-sm font-medium text-charcoal">
            {text}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-sm text-charcoal/70",
          className
        )}
      >
        <Sparkles className="h-4 w-4 text-maize" />
        {text}
      </span>
    );
  }

  return null;
}
