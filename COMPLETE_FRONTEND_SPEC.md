# RAWGLE - Complete Frontend Specification

**Based on**: Screenshots provided
**Approach**: Build entire UI first, connect backend later
**Goal**: Clickable prototype showing full user journey

---

## 🎯 KEY INSIGHTS FROM SCREENSHOTS

### What Works Well:
1. ✅ **Real-time search** - Keep this
2. ✅ **Clean, modern UI** at d5903294.rawgle-frontend-dev.pages.dev
3. ✅ **Top 5 stores only** - Users won't travel further
4. ❌ Don't show all 9,190 suppliers - overwhelming

### Primary Use Cases:
1. **Website** - Supplier discovery (what we're building)
2. **Backend services** - Data processing (separate)
3. **Mobile app** - AI pet health companion (future)

---

## 📱 COMPLETE PAGE STRUCTURE

### Main Navigation (From Screenshots)

```
RAWGLE
├── Home
├── AI Assistant
├── Pet Management
├── Smart Feeding
├── Health & Wellness
├── Community & Social
├── Location Services (Find Suppliers)
├── Shop & Marketplace
├── Education & Learning
├── PAWS Ecosystem
└── Sign In / Get Started
```

### Detailed Pages Needed

#### 1. **Home Page** (/)
- Hero section: "Raw Pet Food"
- Subtitle: "Track feeding schedules, find local suppliers, connect with the community..."
- CTAs: "Start Free Today", "Watch Demo"
- Features grid: Pet Profiles, Smart Calculator, Find Suppliers
- Testimonials
- Footer

#### 2. **AI Assistant** (/ai-assistant)
From screenshot 3:
- Chat interface: "RAWGLE AI Assistant - Your expert in raw pet nutrition"
- Quick Actions sidebar:
  - Calculate Portions
  - Food Safety
  - Nutrition Balance
  - Transition Guide
- AI Features list:
  - Nutrition calculations
  - Food safety guidance
  - Ingredient analysis
  - Meal planning
  - Voice input/output
- Chat history
- Voice input/audio output buttons

#### 3. **Find Suppliers** (/suppliers or /location-services)
From screenshot 1 (rawgle.com):
- Header: "Find Raw Dog Food Near You"
- Tagline: "8,844+ Verified Raw Dog Food Suppliers"
- Search bar: "Search raw dog food stores, BARF suppliers..."
- Two buttons: "🔍 Search" and "📍 Near Me"
- Map with location pin: "You are here (precise location)"
- Supplier cards (5 max):
  - Pet Station - Raw Pet food Supplier
    - Rating: 4.9 (104 reviews)
    - Address: unit 1, Dominion Business Centre, Cardiff CF24 1PT, UK
    - Phone: 029 2049 0249
    - Website link
    - Distance: 160.3 miles away
    - "Write Review" button
  - Raw Pet Foods
    - Rating: 5.0 (55 reviews)
    - etc.

#### 4. **Find a Stockist** (/stockist)
From screenshot 2 (Paleo Ridge style):
- Search: "Type a postcode or address..."
- Filters: Vet, Star Store, Online Only
- Sidebar with store details:
  - The Pet Cabin
  - Address, Opening times
  - Store description
  - Website link
- Map showing location

#### 5. **Pet Management** (/pets)
- Add/manage multiple pets
- Pet profiles with photos
- Health records
- Feeding history
- Weight tracking

#### 6. **Smart Feeding** (/feeding)
- Feeding calculator
- Schedule management
- Portion recommendations
- Auto-order supplements
- Feeding logs with detailed tracking:
  - Food type, protein source
  - Amount, appetite rating
  - Energy level after
  - Stool quality
  - Digestion notes

#### 7. **Health & Wellness** (/health)
- Health dashboard
- Symptoms tracker
- Vet appointments
- Medication reminders
- Health analytics

#### 8. **Community & Social** (/community)
- Discussion forums
- User posts and questions
- Success stories
- Photo sharing
- Community events

#### 9. **Shop & Marketplace** (/shop)
- Browse products
- Supplement marketplace
- Featured suppliers
- Shopping cart
- Order tracking

#### 10. **Education & Learning** (/education)
- Raw feeding guides
- Video tutorials
- Articles and blog
- Expert advice
- Transition guides

#### 11. **PAWS Ecosystem** (/paws)
- PAWS token dashboard
- Earn rewards
- Redeem tokens
- NFT gallery
- Transaction history

---

## 🎨 UI COMPONENTS TO BUILD

### Navigation Bar
```
Logo | AI Assistant | Pet Management | Smart Feeding | Health | Community |
Location | Shop | Education | PAWS | Sign In | Get Started
```

### Supplier Card Component
```
┌─────────────────────────────────────┐
│ ⭐ 4.9 (104 reviews)                │
│ Pet Station - Raw Pet Food Supplier │
│ 📍 Cardiff CF24 1PT, UK             │
│ 📞 029 2049 0249                    │
│ 🌐 petstationcardiff.com            │
│ 📏 160.3 miles away                 │
│ [Write Review]                      │
└─────────────────────────────────────┘
```

### AI Chat Interface
```
┌──────────────┬────────────────────────┐
│ Quick Actions│ Chat Area              │
│              │                        │
│ Calculate    │ Hi! I'm RAWGLE AI      │
│ Portions     │ Your expert assistant  │
│              │                        │
│ Food Safety  │ [Recent messages]      │
│              │                        │
│ Nutrition    │                        │
│ Balance      │                        │
│              │                        │
│ Transition   │ [Input box]            │
│ Guide        │ 🎤 Voice | 🔊 Audio    │
└──────────────┴────────────────────────┘
```

---

## 🗺️ USER JOURNEYS

### Journey 1: Find Local Supplier
1. Land on home page
2. Click "Find Suppliers" in nav
3. See map with "You are here"
4. Click "Near Me" button
5. See closest 5 suppliers
6. Click supplier card → View details
7. Click website link → Visit supplier
8. Return and write review

### Journey 2: Get AI Nutrition Advice
1. Click "AI Assistant" in nav
2. See chat interface
3. Click "Calculate Portions" quick action
4. Fill in pet details
5. Get portion recommendations
6. Ask follow-up questions
7. Save meal plan

### Journey 3: Track Pet Health
1. Click "Pet Management"
2. Add new pet
3. Upload photo, add details
4. Click "Smart Feeding"
5. Log feeding event with all details
6. View health analytics
7. Get AI insights

---

## 📦 MOCK DATA STRUCTURE

### Mock Suppliers (5 only)
```javascript
const mockSuppliers = [
  {
    id: 1,
    name: "Pet Station - Raw Pet Food Supplier",
    rating: 4.9,
    reviews: 104,
    address: "unit 1, Dominion Business Centre, Cardiff CF24 1PT, UK",
    city: "Cardiff",
    phone: "029 2049 0249",
    website: "https://petstationcardiff.com",
    distance: 160.3,
    lat: 51.4816,
    lng: -3.1791
  },
  {
    id: 2,
    name: "Raw Pet Foods",
    rating: 5.0,
    reviews: 55,
    address: "Jesses Farm, Wanden Ln, Egerton Forstal, Ashford TN27 9DB, UK",
    city: "Nashville",
    phone: "01233 756406",
    website: "https://rawpetfoods.co.uk",
    distance: 186.2,
    lat: 51.1789,
    lng: 0.7644
  },
  // ... 3 more
];
```

### Mock Pet
```javascript
const mockPet = {
  id: 1,
  name: "Max",
  species: "Dog",
  breed: "Labrador",
  age: 3,
  weight: 30,
  photo: "/images/max.jpg",
  healthStatus: "Healthy"
};
```

### Mock Feeding Log
```javascript
const mockFeedingLog = {
  id: 1,
  petId: 1,
  date: "2025-10-20",
  foodType: "Raw chicken",
  proteinSource: "Chicken",
  amount: "500g",
  appetiteRating: 5,
  energyLevel: 4,
  stoolQuality: "Normal",
  digestionNotes: "No issues"
};
```

---

## 🎯 IMPLEMENTATION PLAN

### Phase 1: Core Pages (Week 1)
- [ ] Home page with navigation
- [ ] AI Assistant page (chat UI with mock responses)
- [ ] Find Suppliers page (top 5, mock data)
- [ ] Pet Management page (CRUD operations, mock data)
- [ ] All pages linked in navigation

### Phase 2: Feature Pages (Week 2)
- [ ] Smart Feeding page
- [ ] Health & Wellness dashboard
- [ ] Community forum
- [ ] Shop/Marketplace
- [ ] Education hub

### Phase 3: PAWS & Advanced (Week 3)
- [ ] PAWS token dashboard
- [ ] NFT gallery
- [ ] User authentication UI
- [ ] Settings and preferences
- [ ] Mobile responsive polish

### Phase 4: Backend Integration (Week 4)
- [ ] Connect suppliers to real API (limit to 5 closest)
- [ ] Connect AI to real LLM
- [ ] Connect pet data to database
- [ ] Connect feeding logs to database
- [ ] Deploy to production

---

## 🎨 DESIGN SYSTEM (From Screenshots)

### Colors
- Primary: Orange/Pumpkin (#FF9800)
- Secondary: Green (#4CAF50)
- Background: Light cream/beige
- Text: Dark charcoal
- Accents: Blue for links

### Typography
- Headings: Bold, large, clean
- Body: Readable, good spacing
- Buttons: Clear CTAs with icons

### Components
- Cards with shadows
- Rounded corners
- Icons from lucide-react
- Map integration (Leaflet)
- Star ratings
- Distance badges

---

## 📝 FILE STRUCTURE

```
src/
├── app/
│   ├── page.tsx                    # Home
│   ├── ai-assistant/
│   │   └── page.tsx               # AI chat interface
│   ├── suppliers/
│   │   ├── page.tsx               # Find suppliers (top 5)
│   │   └── [id]/
│   │       └── page.tsx           # Supplier detail
│   ├── pets/
│   │   ├── page.tsx               # Pet list
│   │   ├── new/
│   │   │   └── page.tsx           # Add pet
│   │   └── [id]/
│   │       └── page.tsx           # Pet detail
│   ├── feeding/
│   │   └── page.tsx               # Feeding calculator & logs
│   ├── health/
│   │   └── page.tsx               # Health dashboard
│   ├── community/
│   │   └── page.tsx               # Community forum
│   ├── shop/
│   │   └── page.tsx               # Marketplace
│   ├── education/
│   │   └── page.tsx               # Learning hub
│   └── paws/
│       └── page.tsx               # PAWS ecosystem
├── components/
│   ├── navigation/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── suppliers/
│   │   ├── supplier-card.tsx
│   │   └── supplier-map.tsx
│   ├── ai/
│   │   ├── chat-interface.tsx
│   │   └── quick-actions.tsx
│   └── pets/
│       ├── pet-card.tsx
│       └── feeding-form.tsx
└── lib/
    └── mock-data.ts               # All mock data
```

---

## ✅ SUCCESS CRITERIA

### Phase 1 Complete When:
- [ ] Can navigate to all major pages
- [ ] Supplier search shows top 5 with map
- [ ] AI chat interface responds (mock)
- [ ] Can add/view pets (mock)
- [ ] All links work
- [ ] Looks professional and complete

### Phase 2 Complete When:
- [ ] All 11 main pages exist
- [ ] User can complete full journeys
- [ ] Forms work with mock data
- [ ] Animations and transitions smooth
- [ ] Mobile responsive

### Ready for Backend When:
- [ ] Every page is clickable
- [ ] Every form is functional (with mock data)
- [ ] User experience is validated
- [ ] Stakeholders approve UI/UX
- [ ] Design is finalized

---

## 🚀 NEXT STEPS

1. **NOW**: Build navigation component with all links
2. **NEXT**: Build supplier page with top 5 (mock data)
3. **THEN**: Build AI assistant page
4. **AFTER**: Build pet management pages
5. **FINALLY**: Connect to real backend

**Key Principle**: Make it look and feel complete FIRST, then wire up the backend.

This way you can validate the entire user experience before spending time on backend integration.
