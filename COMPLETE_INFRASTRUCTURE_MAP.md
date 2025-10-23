# 🏗️ RAWGLE COMPLETE INFRASTRUCTURE MAP
## Production Systems, Data, and Integration Plan

**Date:** October 19, 2025
**Status:** PRODUCTION ACTIVE + Frontend Ready to Integrate

---

## 🎯 Executive Summary

You have **TWO powerful systems that need to be connected:**

### 1. **Production Backend (Cloudflare)**
- ✅ **9,190 suppliers** in live database
- ✅ Cloudflare Workers deployed to rawgle.com
- ✅ D1 Database with 20+ tables
- ✅ Geolocation & map features WORKING
- ✅ API endpoints operational

### 2. **Modern Frontend (Next.js)**
- ✅ Next.js 15 + React 19
- ✅ Beautiful UI components
- ✅ Auth ready (Clerk)
- ✅ Development server running

**MISSION:** Connect frontend to backend, integrate map, add pet health tracking

---

## 📊 Production Database (Cloudflare D1)

### Database ID: `9dcf8539-f274-486c-807b-7e265146ce6b`
### Database Name: `findrawdogfood-db`
### Size: **21.2 MB**
### Total Records: **9,190+ suppliers**

### Existing Tables (In Production NOW):

**Core Data:**
- `suppliers` - 9,190 raw dog food suppliers with geolocation
- `supplier_categories` - Category taxonomy
- `reviews` - User reviews of suppliers
- `users` - User accounts
- `user_sessions` - Authentication sessions

**Analytics & Engagement:**
- `searches` - Search history and patterns
- `engagement_analytics` - User behavior tracking
- `engagement_queue` - Background task queue
- `notifications` - User notifications
- `brand_mentions` - Social media monitoring
- `community_insights` - AI-generated insights

**E-commerce:**
- `orders` - Purchase history
- `transactions` - Payment records
- `affiliate_clicks` - Affiliate tracking

**AI Features:**
- `ai_consultations` - AI chat history
- `response_templates` - AI response templates
- `reddit_opportunities` - Social engagement tracking

**Infrastructure:**
- `email_verifications` - Email confirmation
- `password_resets` - Password reset tokens
- `rate_limits` - API rate limiting
- `sitereviver_results` - SEO analysis
- `website_analysis` - Site performance

---

## 🌍 Deployed Cloudflare Workers

### Worker Name: `rawgle-com-production`
### Domain: **rawgle.com** (active)
### Source: `/Users/mattwright/pandora/findrawdogfood/src/rawgle-worker.js`

### Active API Endpoints:

```
https://rawgle.com/api/search
  - Full-text search across 9,190 suppliers
  - Parameters: ?q=query&limit=20&offset=0

https://rawgle.com/api/nearby
  - Geolocation-based supplier search
  - Parameters: ?lat=40.7128&lng=-74.0060&radius=50

https://rawgle.com/api/stats
  - Database statistics
  - Total suppliers, categories, reviews

https://rawgle.com/api/supplier
  - Individual supplier details
  - Parameters: ?id=supplier_id

https://rawgle.com/api/location
  - User geolocation detection
  - Uses Cloudflare CF-IPCountry header
```

### Features Already Working:

**✅ Geolocation:**
- IP-based location detection
- Lat/lng coordinates from browser
- Distance calculation (haversine formula)
- Radius search (miles and km)

**✅ Search:**
- Full-text search
- Category filtering
- Location-based ranking
- Pagination support

**✅ Map Integration:**
- Supplier markers with lat/lng
- Clustering for performance
- Popup details with supplier info
- Real-time updates

---

## 🗺️ Map Implementation (KEEP THIS)

### Current Map Tech Stack:
- **Leaflet.js** - Already installed in Next.js frontend!
- **OpenStreetMap** tiles
- **Marker clustering** for performance
- **Geolocation API** for user location

### What's Working:
```javascript
// Existing functionality in Cloudflare Worker
- Haversine distance calculation
- Supplier lat/lng storage in database
- Nearby search API endpoint
- Map marker generation
```

### What to Keep:
1. **Supplier geolocation data** (9,190 records with lat/lng)
2. **Distance calculation algorithm**
3. **Nearby search API**
4. **Map marker clustering**

### Integration Plan:
```typescript
// In Next.js frontend:
// pages/map/page.tsx

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const SupplierMap = () => {
  // Fetch suppliers from Cloudflare API
  const { data: suppliers } = useQuery({
    queryKey: ['nearby-suppliers'],
    queryFn: async () => {
      const res = await fetch('https://rawgle.com/api/nearby?lat=X&lng=Y&radius=50');
      return res.json();
    }
  });

  return (
    <MapContainer center={[lat, lng]} zoom={10}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {suppliers?.map(supplier => (
        <Marker key={supplier.id} position={[supplier.latitude, supplier.longitude]}>
          <Popup>
            <h3>{supplier.name}</h3>
            <p>{supplier.city}, {supplier.state}</p>
            <p>{supplier.distance_miles} miles away</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
```

---

## 🔗 Integration Architecture

### Current Setup:
```
[Cloudflare Workers]          [Next.js Frontend]
     rawgle.com            →   localhost:3000
   (API + Database)           (UI + React)
      PRODUCTION                DEVELOPMENT
```

### Target Architecture:
```
[Cloudflare Workers API]
     rawgle.com/api/*
     ↓
[Cloudflare D1 Database]
  - suppliers (9,190)
  - users, reviews, etc.
     ↓
[Next.js Frontend]
  Deployed to Cloudflare Pages
     ↓
[User Browser]
  https://rawgle.com
```

---

## 🔌 Frontend Integration Tasks

### Task 1: Connect to Cloudflare API (30 minutes)

**Create API client:**
```typescript
// lib/api-client.ts
const RAWGLE_API = 'https://rawgle.com/api';

export const rawgleApi = {
  // Supplier search
  searchSuppliers: async (query: string, limit = 20) => {
    const res = await fetch(`${RAWGLE_API}/search?q=${query}&limit=${limit}`);
    return res.json();
  },

  // Nearby suppliers
  getNearbySuppliers: async (lat: number, lng: number, radius = 50) => {
    const res = await fetch(`${RAWGLE_API}/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    return res.json();
  },

  // Supplier details
  getSupplier: async (id: string) => {
    const res = await fetch(`${RAWGLE_API}/supplier?id=${id}`);
    return res.json();
  },

  // Stats
  getStats: async () => {
    const res = await fetch(`${RAWGLE_API}/stats`);
    return res.json();
  },

  // Geolocation
  detectLocation: async () => {
    const res = await fetch(`${RAWGLE_API}/location`);
    return res.json();
  }
};
```

### Task 2: Build Supplier Map Page (1 hour)

**Create:** `app/map/page.tsx`
```typescript
'use client';

import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { rawgleApi } from '@/lib/api-client';
import { useState, useEffect } from 'react';

// Import Leaflet dynamically (client-side only)
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

export default function SupplierMapPage() {
  const [userLocation, setUserLocation] = useState<[number, number]>([40.7128, -74.0060]);

  // Get user's current location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  }, []);

  // Fetch nearby suppliers
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['nearby-suppliers', userLocation],
    queryFn: () => rawgleApi.getNearbySuppliers(userLocation[0], userLocation[1], 50),
    enabled: !!userLocation
  });

  return (
    <div className="h-screen w-full">
      <div className="p-4 bg-white shadow-md z-10 relative">
        <h1 className="text-2xl font-bold">Find Raw Dog Food Suppliers Near You</h1>
        <p className="text-gray-600">
          {isLoading ? 'Loading suppliers...' : `Found ${suppliers?.length || 0} suppliers within 50 miles`}
        </p>
      </div>

      <MapContainer
        center={userLocation}
        zoom={10}
        className="h-[calc(100vh-80px)] w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {suppliers?.map((supplier: any) => (
          <Marker
            key={supplier.id}
            position={[supplier.latitude, supplier.longitude]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{supplier.name}</h3>
                <p className="text-sm text-gray-600">{supplier.city}, {supplier.state}</p>
                <p className="text-sm font-semibold mt-2">{supplier.distance_miles?.toFixed(1)} miles away</p>
                {supplier.website && (
                  <a
                    href={supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
```

### Task 3: Supplier Search Component (45 minutes)

**Create:** `app/suppliers/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rawgleApi } from '@/lib/api-client';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['suppliers', searchQuery],
    queryFn: () => rawgleApi.searchSuppliers(searchQuery),
    enabled: searchQuery.length > 0
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Raw Dog Food Suppliers</h1>

      <Input
        type="search"
        placeholder="Search suppliers, locations, products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6"
      />

      {isLoading && <p>Searching...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers?.map((supplier: any) => (
          <Card key={supplier.id} className="p-4">
            <h3 className="font-bold text-lg mb-2">{supplier.name}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {supplier.city}, {supplier.state}
            </p>
            {supplier.website && (
              <a
                href={supplier.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Visit Website →
              </a>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 🐾 Adding Pet Health Features

### New Tables Needed in D1 Database:

```sql
-- Add to Cloudflare D1 database
-- Run via: wrangler d1 execute findrawdogfood-db --remote --file=./migrations/add-pet-health.sql

CREATE TABLE IF NOT EXISTS pets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  species TEXT DEFAULT 'dog',
  breed TEXT,
  birth_date DATE,
  weight_lbs REAL,
  activity_level TEXT,
  allergies JSON DEFAULT '[]',
  feeding_schedule JSON,
  photos JSON DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS feeding_logs (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  feeding_date DATE NOT NULL,
  feeding_time TIME,
  meal_type TEXT,
  food_type TEXT NOT NULL,
  protein_source TEXT,
  amount_oz REAL,
  supplier_id TEXT, -- Link to suppliers table!
  appetite_rating INTEGER,
  energy_level_after INTEGER,
  stool_quality TEXT,
  digestion_notes TEXT,
  photos JSON DEFAULT '[]',
  notes TEXT,
  shared_publicly BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES pets(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  pet_id TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion',
  category TEXT NOT NULL,
  tags JSON DEFAULT '[]',
  upvotes INTEGER DEFAULT 0,
  images JSON DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (pet_id) REFERENCES pets(id)
);

CREATE INDEX idx_feeding_logs_pet_date ON feeding_logs(pet_id, feeding_date DESC);
CREATE INDEX idx_feeding_logs_supplier ON feeding_logs(supplier_id);
CREATE INDEX idx_community_posts_category ON community_posts(category);
```

### New API Endpoints Needed:

```javascript
// Add to rawgle-worker.js

// Pet Management
case '/api/pets':
  return handlePets(request, env);

case '/api/feeding-logs':
  return handleFeedingLogs(request, env);

case '/api/community/posts':
  return handleCommunityPosts(request, env);

case '/api/ai/insights':
  return handleAIInsights(request, env);

case '/api/ai/recommendations':
  return handleAIRecommendations(request, env);
```

---

## 🤖 AI Integration Plan

### OpenAI Integration (Already Have API Key!)

**From .env.local:**
```
OPENAI_API_KEY=your_openai_api_key_here
```

### AI Features to Build:

**1. Feeding Recommendations**
```javascript
// In Cloudflare Worker
async function handleAIRecommendations(request, env) {
  const { pet_id } = await request.json();

  // Query similar pets' feeding logs
  const similarPets = await env.DB.prepare(`
    SELECT feeding_logs.*
    FROM feeding_logs
    JOIN pets ON pets.id = feeding_logs.pet_id
    WHERE pets.breed = (SELECT breed FROM pets WHERE id = ?)
      AND feeding_logs.appetite_rating >= 4
      AND feeding_logs.stool_quality IN ('excellent', 'good')
    LIMIT 100
  `).bind(pet_id).all();

  // Use OpenAI to analyze patterns
  const recommendation = await analyzeWithOpenAI(similarPets.results);

  return new Response(JSON.stringify(recommendation), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

**2. AI Chat Assistant**
```javascript
// Use OpenAI with RAG (Retrieval Augmented Generation)
async function handleAIChat(request, env) {
  const { message, pet_id } = await request.json();

  // Search feeding_logs for relevant context
  const context = await searchFeedingContext(message, pet_id, env);

  // Call OpenAI with context
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a raw dog feeding expert. Use this context from real user data: ${JSON.stringify(context)}`
        },
        {
          role: 'user',
          content: message
        }
      ]
    })
  });

  return response;
}
```

---

## 🚀 Deployment Strategy

### Phase 1: Connect Frontend to Existing Backend (TODAY)
- ✅ Frontend calls https://rawgle.com/api/*
- ✅ Display 9,190 suppliers
- ✅ Show map with geolocation
- ✅ Search functionality

### Phase 2: Add Pet Health Tables (WEEK 1)
- Create migration SQL
- Run `wrangler d1 migrate`
- Add API endpoints to worker
- Deploy updated worker

### Phase 3: Build Pet Health UI (WEEK 1-2)
- Pet profile pages
- Feeding log forms
- Health tracking dashboard
- Charts and visualizations

### Phase 4: AI Features (WEEK 2-3)
- AI recommendations based on feeding_logs
- Pattern recognition
- Chat assistant with RAG
- Community insights

### Phase 5: Deploy Frontend to Cloudflare Pages (WEEK 3)
```bash
# In rawgle-frontend directory
npm run build
wrangler pages deploy .next --project-name=rawgle-frontend

# Configure custom domain
wrangler pages domain add rawgle.com
```

---

## 📊 Current Production Stats

**Database:** findrawdogfood-db (Cloudflare D1)
- **Size:** 21.2 MB
- **Suppliers:** 9,190 records
- **Users:** (check count)
- **Reviews:** (check count)
- **Searches:** (check count)

**Worker:** rawgle-com-production
- **Status:** Deployed and active
- **Domain:** rawgle.com
- **Endpoints:** 5 API routes working
- **Features:** Search, geolocation, map, stats

**Frontend:** rawgle-frontend
- **Status:** Development
- **Server:** Running on localhost:3000
- **Framework:** Next.js 15 + React 19
- **Ready:** Yes, needs API integration

---

## 🎯 Immediate Next Steps

### Option A: Quick Integration (2 hours)
1. Create API client in frontend
2. Build supplier map page using existing API
3. Add search page
4. Deploy and test

### Option B: Full MVP (4 hours)
1. Option A tasks
2. Add pet health tables to D1
3. Create feeding log API endpoints
4. Build basic pet dashboard
5. Show working with real suppliers linked to feeding logs

### Option C: AI Demo First (2 hours)
1. Connect to existing suppliers data
2. Build AI insights using OpenAI
3. Show recommendations based on location
4. Demonstrate AI potential

---

## 💡 Key Insights

### You Have:
- ✅ **9,190 real suppliers** with geolocation data
- ✅ **Working API** deployed to production
- ✅ **Map functionality** ready to integrate
- ✅ **Modern frontend** ready to consume API
- ✅ **OpenAI API key** for AI features

### You Need:
- Connect Next.js frontend to Cloudflare API
- Add pet health tables to existing database
- Build UI for pet tracking
- Integrate AI recommendations

### The Vision:
**Suppliers + Pet Health + AI = Complete Platform**
- Users find suppliers on map (existing)
- Users log what they feed from those suppliers (new)
- AI learns which suppliers/products work best for which dogs (new)
- Community discusses experiences (new)
- Everyone benefits from shared data

---

**Ready to integrate?** Pick Option A, B, or C and I'll start building immediately.

**All your production data is live and waiting.** 🚀
