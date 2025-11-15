/**
 * Product Type Definitions
 * Interfaces for the Rawgle product management system
 */

export interface ProductVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  inventory: number;
  gelatoVariantUid?: string;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  gelatoProductUid?: string; // Link to Gelato product
  variants: ProductVariant[];
  categories: string[];
  tags: string[];
  inStock: boolean;
  inventory: number;
  status: 'active' | 'draft' | 'archived';
  seo: {
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;

  // Additional fields for admin management
  supplier?: string;
  sales?: number;
  lastSyncedAt?: string; // Last time synced with Gelato
  gelatoSyncStatus?: 'synced' | 'pending' | 'error' | 'never';
}

export interface ProductFilters {
  category?: string;
  status?: 'active' | 'draft' | 'archived' | 'all';
  search?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'sales';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductListResponse {
  success: boolean;
  products: Product[];
  total: number;
  page: number;
  limit: number;
  error?: string;
}

export interface ProductResponse {
  success: boolean;
  product?: Product;
  error?: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  gelatoProductUid?: string;
  variants?: Omit<ProductVariant, 'id'>[];
  categories: string[];
  tags: string[];
  inventory: number;
  status: 'active' | 'draft' | 'archived';
  seo?: {
    metaDescription: string;
    keywords: string[];
  };
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: string;
}

export interface GelatoSyncResponse {
  success: boolean;
  message: string;
  synced?: number;
  failed?: number;
  products?: Product[];
  error?: string;
}
