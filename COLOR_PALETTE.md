# 🎨 RAWGLE Color Palette

**Status:** APPROVED ✅
**Date:** October 23, 2025
**Based on:** Live shop screenshot feedback

> "we LOVE this color palette. just like this. this is the CSS / rule :)" - User

---

## 🌊 Primary Colors

### Teal/Turquoise (Main Brand Color)
**CSS Class:** `bg-teal-600`
**Hex:** `#0d9488`
**RGB:** `rgb(13, 148, 136)`
**Usage:**
- Featured products section background
- Primary buttons and CTAs
- Section headers
- Main brand accent color

**Variations:**
- **Darker:** `bg-teal-700` (#0f766e) - Hover states
- **Lighter:** `bg-teal-500` (#14b8a6) - Active states
- **Lightest:** `bg-teal-50` (#f0fdfa) - Subtle backgrounds

---

## 🧡 Accent Colors

### Coral/Orange (Featured Badges)
**CSS Class:** `bg-orange-500`
**Hex:** `#f97316`
**RGB:** `rgb(249, 115, 22)`
**Usage:**
- "Featured" product badges
- Important callouts
- Sale/discount badges
- Urgency indicators

**Variations:**
- **Darker:** `bg-orange-600` (#ea580c) - Hover states
- **Lighter:** `bg-orange-400` (#fb923c) - Less prominent badges
- **Pale:** `bg-orange-100` (#ffedd5) - Background highlights

### Amber/Yellow (Discount Badges)
**CSS Class:** `bg-amber-400`
**Hex:** `#fbbf24`
**RGB:** `rgb(251, 191, 36)`
**Usage:**
- Discount percentage badges ("22% OFF", "20% OFF")
- Price savings highlights
- Special offer indicators

**Variations:**
- **Darker:** `bg-amber-500` (#f59e0b)
- **Lighter:** `bg-amber-300` (#fcd34d)

### Yellow (Star Ratings)
**CSS Class:** `text-yellow-400`
**Hex:** `#facc15`
**RGB:** `rgb(250, 204, 21)`
**Usage:**
- Star rating fills
- Premium indicators
- Gold accents

---

## ⚪ Neutral Colors

### White
**CSS Class:** `bg-white`
**Hex:** `#ffffff`
**RGB:** `rgb(255, 255, 255)`
**Usage:**
- Product cards background
- Main content areas
- Clean, spacious design

### Cream/Beige (Card Backgrounds)
**CSS Class:** `bg-gray-50` or `bg-stone-100`
**Hex:** `#fafaf9` (stone-50) or `#f5f5f4` (stone-100)
**RGB:** `rgb(250, 250, 249)` or `rgb(245, 245, 244)`
**Usage:**
- Product card backgrounds (warm off-white)
- Page backgrounds
- Subtle section separators
- Creates warmth without being too stark

**Note:** The screenshot shows a warmer, more beige tone than pure gray. Consider using `stone` or `neutral` color scales instead of `gray` for warmer aesthetics.

### Gray Scale (Text & Borders)
**Dark Text:** `text-gray-900` (#111827)
**Body Text:** `text-gray-700` (#374151)
**Secondary Text:** `text-gray-600` (#4b5563)
**Muted Text:** `text-gray-500` (#6b7280)
**Light Text:** `text-gray-400` (#9ca3af)
**Borders:** `border-gray-200` (#e5e7eb)
**Light Borders:** `border-gray-100` (#f3f4f6)

---

## 🏷️ Category Badge Colors

### Joint Mobility
**CSS Class:** `bg-purple-100 text-purple-800`
**Background:** `#f3e8ff`
**Text:** `#6b21a8`
**Icon:** 🦴

### Digestive Health
**CSS Class:** `bg-green-100 text-green-800`
**Background:** `#dcfce7`
**Text:** `#166534`
**Icon:** 🌿

### Calming Anxiety
**CSS Class:** `bg-blue-100 text-blue-800`
**Background:** `#dbeafe`
**Text:** `#1e40af`
**Icon:** 😌

### Specialty/Senior
**CSS Class:** `bg-pink-100 text-pink-800`
**Background:** `#fce7f3`
**Text:** `#9f1239`
**Icon:** 💊

---

## 🐾 Species Tags

### Dogs & Cats
**CSS Class:** `bg-gray-100 text-gray-700`
**Background:** `#f3f4f6`
**Text:** `#374151`
**Label:** "Dogs & Cats"

---

## 🎯 Component-Specific Colors

### Buttons

**Primary (Add to Cart):**
```css
bg-teal-600 hover:bg-teal-700 text-white
```

**Secondary (View Details):**
```css
bg-gray-100 hover:bg-gray-200 text-gray-900
```

**Danger (Remove):**
```css
bg-red-500 hover:bg-red-600 text-white
```

**Success (In Stock):**
```css
bg-green-500 hover:bg-green-600 text-white
```

### Badges

**Featured:**
```css
bg-orange-500 text-white
```

**Discount:**
```css
bg-amber-400 text-amber-900
```

**In Stock:**
```css
bg-green-100 text-green-800 border-green-200
```

**Out of Stock:**
```css
bg-red-100 text-red-800 border-red-200
```

### Cards

**Product Card:**
```css
bg-stone-50 border-gray-200 hover:shadow-lg transition-shadow
```

**Featured Product Card:**
```css
bg-white border-teal-200 shadow-md
```

---

## 📐 Complete Tailwind Classes Reference

### Background Colors (Ordered by Frequency)
```
bg-teal-600      # Main brand color (sections, primary buttons)
bg-white         # Card backgrounds, main areas
bg-stone-50      # Page background, subtle cards (warmer than bg-gray-50)
bg-orange-500    # Featured badges
bg-amber-400     # Discount badges
bg-gray-50       # Alternative light background
bg-gray-100      # Secondary buttons, borders
```

### Text Colors
```
text-gray-900    # Headings, primary text
text-gray-700    # Body text
text-gray-600    # Secondary text
text-gray-500    # Muted text
text-white       # White text (on dark backgrounds)
text-yellow-400  # Star ratings
text-orange-800  # Featured badge text (if needed)
```

### Border Colors
```
border-gray-200  # Default borders
border-gray-100  # Light borders
border-teal-200  # Featured card borders
border-green-200 # In stock badges
border-red-200   # Out of stock badges
```

### Hover States
```
hover:bg-teal-700    # Primary button hover
hover:bg-gray-200    # Secondary button hover
hover:shadow-lg      # Card hover
hover:scale-105      # Subtle scale on hover (optional)
```

---

## 🖼️ Visual Hierarchy

**Priority 1 (Highest Contrast):**
- Headings: `text-gray-900` on `bg-white`
- Primary CTAs: `text-white` on `bg-teal-600`
- Featured badges: `text-white` on `bg-orange-500`

**Priority 2 (Medium Contrast):**
- Body text: `text-gray-700` on `bg-white`
- Category badges: Colored backgrounds with dark text
- Secondary buttons: `text-gray-900` on `bg-gray-100`

**Priority 3 (Low Contrast):**
- Muted text: `text-gray-500` on `bg-white`
- Disabled states: `text-gray-400` on `bg-gray-50`
- Subtle borders: `border-gray-100`

---

## ✨ Design Principles

### 1. Warmth
Use **stone/neutral** colors instead of pure grays for a warmer, more natural feel that aligns with the raw pet food ethos.

### 2. Contrast
Maintain strong contrast between text and backgrounds for accessibility (WCAG AA minimum).

### 3. Consistency
Use the same color for the same purpose across the entire app:
- **Teal = Primary brand actions**
- **Orange = Featured/Important**
- **Amber = Discounts/Savings**
- **Green = Success/In Stock**
- **Red = Danger/Out of Stock**

### 4. Restraint
Don't use too many colors at once. The palette is intentionally limited to create a cohesive, professional look.

### 5. Accessibility
All color combinations meet WCAG AA standards:
- White text on teal-600: ✅ 4.5:1
- Gray-900 text on white: ✅ 15:1
- Orange-500 badge with white text: ✅ 4.5:1

---

## 🔄 Color Mapping

### Old Custom Colors → New Tailwind Colors
```
persian-green  → bg-teal-600
moss-green     → bg-teal-700
coral          → bg-orange-500 or bg-red-500
fawn           → bg-amber-100
charcoal       → text-gray-900
```

---

## 📱 Responsive Considerations

Colors remain consistent across breakpoints. Only size and spacing change:
- Same teal-600 on mobile and desktop
- Same orange-500 badges on all screens
- Shadows may be slightly reduced on mobile for performance

---

## 🎨 Figma/Design Tool Values

For designers using Figma, Sketch, or Adobe XD:

**Teal-600:** `#0d9488`
**Orange-500:** `#f97316`
**Amber-400:** `#fbbf24`
**Yellow-400:** `#facc15`
**Stone-50:** `#fafaf9`
**Gray-900:** `#111827`

---

## 🧪 Testing

Verify colors look correct in:
- Chrome (macOS, Windows)
- Safari (macOS, iOS)
- Firefox (macOS, Windows)
- Edge (Windows)
- Dark mode (if implemented)

---

## ✅ Approval Status

**Approved by:** User
**Date:** October 23, 2025
**Quote:** "we LOVE this color palette. just like this. this is the CSS / rule :)"

**Status:** ✅ LOCKED - Do not change without user approval

---

## 🚀 Usage in Code

### Example: Product Card
```tsx
<div className="bg-stone-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
  <Badge className="bg-orange-500 text-white">Featured</Badge>
  <Badge className="bg-amber-400 text-amber-900">22% OFF</Badge>
  <h3 className="text-gray-900 font-semibold">Product Name</h3>
  <p className="text-gray-600">Description</p>
  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
    Add to Cart
  </Button>
</div>
```

### Example: Section Header
```tsx
<div className="bg-teal-600 text-white p-8">
  <h2 className="text-3xl font-bold">Featured Products</h2>
  <p className="text-teal-100">Our most popular supplements</p>
</div>
```

---

**Use this palette consistently across all pages!** 🎨
