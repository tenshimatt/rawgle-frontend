'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Loader2, Trash2, Image as ImageIcon, X } from 'lucide-react';

interface Post {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  category?: 'general' | 'health' | 'nutrition' | 'success' | 'question';
  tags?: string[];
  photos?: string[];
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt?: string;
}

interface EditPostDialogProps {
  post: Post;
  currentUserId: string;
  onPostUpdated?: () => void;
  onPostDeleted?: () => void;
}

export function EditPostDialog({
  post,
  currentUserId,
  onPostUpdated,
  onPostDeleted,
}: EditPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    category: post.category || 'general',
    tags: post.tags || [],
    photos: post.photos || (post.image ? [post.image] : []),
  });

  // Update form when post changes
  useEffect(() => {
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category || 'general',
      tags: post.tags || [],
      photos: post.photos || (post.image ? [post.image] : []),
    });
  }, [post]);

  // Only show edit button for post owner
  if (post.userId !== currentUserId) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/community/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId,
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags,
          photos: formData.photos,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update post');
      }

      setOpen(false);
      onPostUpdated?.();
    } catch (error) {
      console.error('Error updating post:', error);
      alert(error instanceof Error ? error.message : 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/community/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': currentUserId,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete post');
      }

      setOpen(false);
      onPostDeleted?.();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addPhoto = (photoUrl: string) => {
    if (photoUrl.trim() && formData.photos.length < 3) {
      handleChange('photos', [...formData.photos, photoUrl.trim()]);
    }
  };

  const removePhoto = (index: number) => {
    handleChange('photos', formData.photos.filter((_, i) => i !== index));
  };

  const [photoInput, setPhotoInput] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-900 hover:bg-gray-900/10">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Edit Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="label-base">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="input-base"
              placeholder="Share something with the community..."
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="label-base">
              Content *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className="input-base min-h-[150px]"
              placeholder="Tell us more about your experience, tips, or ask for advice..."
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="label-base">
              Category
            </Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="input-base w-full px-3 py-2 border border-gray-900/20 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="general">General</option>
              <option value="health">Health</option>
              <option value="nutrition">Nutrition</option>
              <option value="success">Success Story</option>
              <option value="question">Question</option>
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="label-base">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="input-base flex-1"
                placeholder="Add tags (press Enter)"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                className="btn-outline"
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-teal-600/10 text-teal-600 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-teal-600/70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <Label htmlFor="photos" className="label-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Photos (Max 3)
            </Label>
            {formData.photos.length < 3 && (
              <div className="flex gap-2">
                <Input
                  id="photos"
                  type="url"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPhoto(photoInput);
                      setPhotoInput('');
                    }
                  }}
                  className="input-base flex-1"
                  placeholder="https://example.com/photo.jpg"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addPhoto(photoInput);
                    setPhotoInput('');
                  }}
                  className="btn-outline"
                  disabled={!photoInput.trim()}
                >
                  Add
                </Button>
              </div>
            )}
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-900/60">
              {formData.photos.length}/3 photos added
            </p>
          </div>

          {/* Content Preview */}
          {formData.content && (
            <div className="space-y-2">
              <Label className="label-base">Preview</Label>
              <div className="p-4 bg-sea-salt rounded-lg border border-gray-900/10">
                <p className="text-gray-900 whitespace-pre-wrap">{formData.content}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading || deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="btn-outline"
              disabled={loading || deleting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" className="btn-secondary" disabled={loading || deleting}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
