'use client';

import { LikeButton } from './like-button';
import { SaveButton } from './save-button';
import { ShareButton } from './share-button';
import { CommentSection } from './comment-section';

interface SocialActionsProps {
  itemId: string;
  itemType: 'post' | 'recipe';
  title: string;
  description?: string;
  initialLikes: number;
  initialLiked?: boolean;
  initialSaved?: boolean;
  initialComments?: number;
  showComments?: boolean;
  onLike?: (liked: boolean, newCount: number) => void;
  onSave?: (saved: boolean) => void;
}

export function SocialActions({
  itemId,
  itemType,
  title,
  description,
  initialLikes,
  initialLiked = false,
  initialSaved = false,
  initialComments = 0,
  showComments = true,
  onLike,
  onSave,
}: SocialActionsProps) {
  return (
    <div className="space-y-3">
      {/* Action Buttons Row */}
      <div className="flex items-center gap-4">
        <LikeButton
          itemId={itemId}
          itemType={itemType}
          initialLikes={initialLikes}
          initialLiked={initialLiked}
          onLike={onLike}
          size="md"
          showCount={true}
        />

        {showComments && (
          <CommentSection
            itemId={itemId}
            itemType={itemType}
            initialCommentCount={initialComments}
          />
        )}

        <div className="flex-1" />

        <SaveButton
          itemId={itemId}
          itemType={itemType}
          initialSaved={initialSaved}
          onSave={onSave}
          size="md"
          showText={false}
        />

        <ShareButton
          itemId={itemId}
          itemType={itemType}
          title={title}
          description={description}
          size="md"
          showText={false}
        />
      </div>
    </div>
  );
}
