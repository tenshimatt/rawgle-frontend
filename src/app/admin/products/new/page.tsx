'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import type { ProductVariant } from '@/types/product';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gelatoProducts, setGelatoProducts] = useState<any[]>([]);
  const [loadingGelato, setLoadingGelato] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    images: [''],
    gelatoProductUid: '',
    categories: [''],
    tags: [''],
    inventory: '0',
    status: 'draft' as 'active' | 'draft' | 'archived',
    metaDescription: '',
    keywords: [''],
  });

  const [variants, setVariants] = useState<Partial<ProductVariant>[]>([
    { size: '', color: '', price: 0, inventory: 0 },
  ]);

  useEffect(() => {
    loadGelatoProducts();
  }, []);

  const loadGelatoProducts = async () => {
    setLoadingGelato(true);
    try {
      const res = await fetch('/v2/api/admin/products/sync-gelato');
      const data = await res.json();
      if (data.success && data.products) {
        // Extract unique Gelato products from synced products
        const uniqueGelato = data.products
          .filter((p: any) => p.gelatoProductUid)
          .map((p: any) => ({ uid: p.gelatoProductUid, title: p.name }));
        setGelatoProducts(uniqueGelato);
      }
    } catch (error) {
      console.error('Failed to load Gelato products:', error);
    } finally {
      setLoadingGelato(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field: string, index: number, value: string) => {
    setFormData(prev => {
      const array = [...(prev[field as keyof typeof prev] as string[])];
      array[index] = value;
      return { ...prev, [field]: array };
    });
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), ''],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants(prev => {
      const newVariants = [...prev];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return newVariants;
    });
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { size: '', color: '', price: parseFloat(formData.price) || 0, inventory: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        images: formData.images.filter(img => img.trim() !== ''),
        gelatoProductUid: formData.gelatoProductUid || undefined,
        variants: variants.filter(v => v.size || v.color).map(v => ({
          size: v.size,
          color: v.color,
          price: v.price || parseFloat(formData.price),
          inventory: v.inventory || 0,
        })),
        categories: formData.categories.filter(c => c.trim() !== ''),
        tags: formData.tags.filter(t => t.trim() !== ''),
        inventory: parseInt(formData.inventory),
        status: formData.status,
        seo: {
          metaDescription: formData.metaDescription || formData.description.substring(0, 160),
          keywords: formData.keywords.filter(k => k.trim() !== ''),
        },
      };

      const res = await fetch('/v2/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert('Product created successfully!');
        router.push('/admin/products');
      } else {
        alert(`Failed to create product: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          onClick={() => router.push('/admin/products')}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-600 mt-2">Add a new product to your catalog</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="e.g., Premium Chicken Wings"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                rows={4}
                placeholder="Detailed product description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="compareAtPrice">Compare at Price</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => handleInputChange('compareAtPrice', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inventory">Inventory *</Label>
                <Input
                  id="inventory"
                  type="number"
                  value={formData.inventory}
                  onChange={(e) => handleInputChange('inventory', e.target.value)}
                  required
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Gelato Integration */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Gelato Integration (Optional)</h2>
            <Button
              type="button"
              onClick={loadGelatoProducts}
              variant="outline"
              size="sm"
              disabled={loadingGelato}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingGelato ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <div>
            <Label htmlFor="gelatoProductUid">Gelato Product UID</Label>
            <Input
              id="gelatoProductUid"
              value={formData.gelatoProductUid}
              onChange={(e) => handleInputChange('gelatoProductUid', e.target.value)}
              placeholder="e.g., gelato_mug_001"
            />
            <p className="text-sm text-gray-500 mt-1">
              Link to a Gelato print-on-demand product for fulfillment
            </p>
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>
          <div className="space-y-3">
            {formData.images.map((img, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={img}
                  onChange={(e) => handleArrayInputChange('images', index, e.target.value)}
                  placeholder="Image URL"
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('images', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('images')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>
        </Card>

        {/* Variants */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-5 gap-2 p-3 bg-gray-50 rounded-lg">
                <Input
                  placeholder="Size"
                  value={variant.size || ''}
                  onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                />
                <Input
                  placeholder="Color"
                  value={variant.color || ''}
                  onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={variant.price || ''}
                  onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Inventory"
                  value={variant.inventory || ''}
                  onChange={(e) => handleVariantChange(index, 'inventory', parseInt(e.target.value))}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeVariant(index)}
                  disabled={variants.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </div>
        </Card>

        {/* Categories & Tags */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Categories & Tags</h2>
          <div className="space-y-4">
            <div>
              <Label>Categories *</Label>
              <div className="space-y-2">
                {formData.categories.map((cat, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={cat}
                      onChange={(e) => handleArrayInputChange('categories', index, e.target.value)}
                      placeholder="Category name"
                    />
                    {formData.categories.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('categories', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('categories')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>

            <div>
              <Label>Tags *</Label>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => handleArrayInputChange('tags', index, e.target.value)}
                      placeholder="Tag name"
                    />
                    {formData.tags.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('tags', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('tags')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* SEO */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                rows={2}
                placeholder="SEO meta description (160 characters max)"
                maxLength={160}
              />
            </div>
            <div>
              <Label>SEO Keywords</Label>
              <div className="space-y-2">
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={keyword}
                      onChange={(e) => handleArrayInputChange('keywords', index, e.target.value)}
                      placeholder="Keyword"
                    />
                    {formData.keywords.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('keywords', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('keywords')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Keyword
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
