# Rawgle Platform - Complete OpenProject Task Breakdown

## 📊 Overview

This document contains **ALL tasks** for the Rawgle platform, extracted from the existing codebase. Each task follows the OpenProject template with:
- Full acceptance criteria based on working features
- Spec file references
- Good code examples from your own codebase
- Target files for automation

**Total Features Identified:**
- **66 Pages** (UI features)
- **77 API Routes** (backend features)
- **~90 Complete Tasks** when broken down by feature

---

## 🎯 How to Use This

### Option 1: Import to OpenProject via CSV
1. Copy tasks from this document to CSV format
2. OpenProject → Import → Upload CSV
3. Map columns to OpenProject fields

### Option 2: Run Against Existing Build
1. Move each task to "In Progress" in OpenProject
2. n8n automation pipeline triggers
3. Claude analyzes current code vs spec
4. Tests run automatically
5. Results posted to OpenProject

### Option 3: Manual Task Creation
1. Copy task template
2. Paste into OpenProject new task
3. Fill in SPEC_FILE, GOOD_EXAMPLES, TARGET_FILES
4. Move to "In Progress" to trigger automation

---

## 📋 Complete Task List

### Module: Authentication (7 tasks)

#### TASK-001: Login Flow
**Subject:** `[AUTO] Authentication - Login Flow`

**Description:**
```markdown
## Feature Requirements
Allow users to log in with email and password. Support JWT token authentication with refresh tokens. Store auth state globally using React Context.

## Current Implementation
- Login form at /auth/login
- POST /api/auth/login endpoint
- JWT + refresh token generation
- AuthContext for global state
- Auto-login in development mode

## Technical Requirements
- Validate email/password format
- Hash password comparison using bcrypt
- Generate JWT (15min expiry) + refresh token (7 days)
- Store tokens in localStorage + httpOnly cookies
- Update AuthContext with user data
- Redirect to /dashboard on success

## Acceptance Criteria
- [ ] User can enter email and password
- [ ] Form validates email format
- [ ] Form validates password not empty
- [ ] Submitting calls POST /api/auth/login
- [ ] Success: Returns { user, token, refreshToken }
- [ ] Success: Tokens stored in localStorage
- [ ] Success: httpOnly cookies set
- [ ] Success: AuthContext updated
- [ ] Success: Redirect to /dashboard
- [ ] Failure: Toast shows error message
- [ ] Loading spinner during API call
- [ ] "Forgot Password" link works
- [ ] Works on mobile devices
- [ ] Auto-login works in dev mode

## API Contract

### Request
```json
{
  "email": "demo@rawgle.com",
  "password": "Demo1234"
}
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "demo@rawgle.com",
      "role": "user"
    },
    "token": "eyJhbGc...",
    "refreshToken": "abc123...",
    "expiresIn": 900000
  }
}
```

### Error Response (401)
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

SPEC_FILE: /specs/features/auth-login.yml
GOOD_EXAMPLES: /src/app/auth/register/page.tsx, /src/contexts/auth-context.tsx, /src/app/api/auth/login/route.ts
TARGET_FILES: /src/app/auth/login/page.tsx, /src/app/api/auth/login/route.ts, /src/contexts/auth-context.tsx

---

## Testing Instructions
1. Navigate to http://localhost:3005/auth/login
2. Enter valid credentials: demo@rawgle.com / Demo1234
3. Click "Sign In" button
4. Verify redirect to /dashboard
5. Check localStorage for auth-token
6. Check cookies for httpOnly token
7. Test invalid credentials (should show error toast)
8. Test empty fields (should show validation errors)
9. Test "Forgot Password" link navigation
10. Test on mobile viewport
```

**Priority:** High
**Status:** Ready for Review (Implemented)
**Category:** Authentication

---

#### TASK-002: Registration Flow
**Subject:** `[AUTO] Authentication - Registration Flow`

**Description:**
```markdown
## Feature Requirements
Allow new users to create accounts. Auto-login after successful registration. Generate JWT tokens immediately.

## Current Implementation
- Registration form at /auth/register
- POST /api/auth/register endpoint
- Bcrypt password hashing
- Auto-login with token generation
- Session creation on registration

## Technical Requirements
- Validate email format and uniqueness
- Validate password strength (8+ chars)
- Hash password with bcrypt (10 rounds)
- Generate user ID with timestamp
- Create JWT + refresh tokens
- Create session immediately
- Return tokens in response
- Set httpOnly cookies

## Acceptance Criteria
- [ ] User can enter email, password, confirm password
- [ ] Email must be valid format
- [ ] Password must be 8+ characters
- [ ] Passwords must match
- [ ] Duplicate email returns error
- [ ] POST /api/auth/register called on submit
- [ ] Success: User created in database
- [ ] Success: Tokens generated
- [ ] Success: Session created
- [ ] Success: Auto-logged in
- [ ] Success: Redirected to /dashboard
- [ ] Success: Welcome toast shown
- [ ] Failure: Error toast with specific message
- [ ] Loading state during registration

## API Contract

### Request
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

### Success Response (201)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_1761429992575_is4eoalwo",
      "email": "newuser@example.com",
      "role": "user",
      "createdAt": "2025-10-26T..."
    },
    "token": "eyJhbGc...",
    "refreshToken": "abc123...",
    "expiresIn": 900000
  },
  "message": "Account created successfully. You are now logged in."
}
```

### Error Response (409)
```json
{
  "success": false,
  "error": "Email already registered"
}
```

---

SPEC_FILE: /specs/features/auth-register.yml
GOOD_EXAMPLES: /src/app/auth/login/page.tsx, /src/app/api/auth/login/route.ts
TARGET_FILES: /src/app/auth/register/page.tsx, /src/app/api/auth/register/route.ts

---

## Testing Instructions
1. Navigate to /auth/register
2. Enter new email + password
3. Confirm password matches
4. Submit form
5. Verify auto-login (redirect to /dashboard)
6. Verify tokens in localStorage + cookies
7. Test duplicate email (should error)
8. Test password mismatch (should error)
9. Test weak password (should error)
10. Test form validation
```

**Priority:** High
**Status:** Ready for Review (Implemented)
**Category:** Authentication

---

#### TASK-003: Logout Flow
**Subject:** `[AUTO] Authentication - Logout Flow`

**Description:**
```markdown
## Feature Requirements
Allow users to securely log out. Clear all authentication data from client and server.

## Current Implementation
- POST /api/auth/logout endpoint
- Clears localStorage tokens
- Clears cookies
- Destroys server session
- Redirects to homepage

## Acceptance Criteria
- [ ] Logout button in header works
- [ ] POST /api/auth/logout called
- [ ] localStorage cleared
- [ ] Cookies cleared
- [ ] Session destroyed on server
- [ ] Redirect to / (homepage)
- [ ] AuthContext reset
- [ ] Cart/wishlist cleared (optional)
- [ ] "Logged out successfully" toast shown

---

SPEC_FILE: /specs/features/auth-logout.yml
GOOD_EXAMPLES: /src/app/api/auth/login/route.ts
TARGET_FILES: /src/app/api/auth/logout/route.ts, /src/contexts/auth-context.tsx
```

**Priority:** Medium
**Category:** Authentication

---

#### TASK-004: Password Reset (Forgot Password)
**Subject:** `[AUTO] Authentication - Password Reset Flow`

**Description:**
```markdown
## Feature Requirements
Allow users to reset forgotten passwords via email link.

## Current Implementation
- Forgot password form at /auth/forgot-password
- POST /api/auth/forgot-password (generates reset token)
- Email sent with reset link
- Reset form at /auth/reset-password/[token]
- POST /api/auth/reset-password/[token] (updates password)

## Acceptance Criteria
- [ ] User enters email on forgot password page
- [ ] Reset token generated and emailed
- [ ] Email contains valid reset link
- [ ] Token expires after 1 hour
- [ ] User can set new password via link
- [ ] New password validated (8+ chars)
- [ ] Password updated in database
- [ ] Old password no longer works
- [ ] Success redirect to /auth/login
- [ ] Used tokens cannot be reused

---

SPEC_FILE: /specs/features/auth-password-reset.yml
GOOD_EXAMPLES: /src/app/auth/register/page.tsx
TARGET_FILES: /src/app/auth/forgot-password/page.tsx, /src/app/api/auth/forgot-password/route.ts, /src/app/api/auth/reset-password/[token]/route.ts
```

**Priority:** Medium
**Category:** Authentication

---

#### TASK-005: Session Refresh
**Subject:** `[AUTO] Authentication - Token Refresh Flow`

**Description:**
```markdown
## Feature Requirements
Automatically refresh expired JWT tokens using refresh token.

## Current Implementation
- POST /api/auth/refresh endpoint
- Accepts refresh token
- Validates refresh token
- Issues new JWT token
- Updates session expiry

## Acceptance Criteria
- [ ] AuthContext checks token expiry
- [ ] Auto-refresh before expiry (30s margin)
- [ ] POST /api/auth/refresh called
- [ ] New token stored in localStorage
- [ ] New cookie set
- [ ] Refresh fails if refresh token expired
- [ ] User logged out if refresh fails
- [ ] No interruption to user experience

---

SPEC_FILE: /specs/features/auth-token-refresh.yml
GOOD_EXAMPLES: /src/app/api/auth/login/route.ts
TARGET_FILES: /src/app/api/auth/refresh/route.ts, /src/contexts/auth-context.tsx
```

**Priority:** High
**Category:** Authentication

---

#### TASK-006: Auth Context State Management
**Subject:** `[AUTO] Authentication - Global Auth State`

**Description:**
```markdown
## Feature Requirements
Manage authentication state globally across app using React Context.

## Current Implementation
- AuthContext with user, login, logout, checkAuth
- Persisted tokens in localStorage
- Auto-login on app load if token valid
- Protected routes via middleware

## Acceptance Criteria
- [ ] AuthContext provides: user, loading, login, logout
- [ ] checkAuth runs on app mount
- [ ] Valid tokens restore user session
- [ ] Invalid/expired tokens trigger logout
- [ ] Loading state during auth check
- [ ] Auto-login in development mode
- [ ] Context updates on login/logout
- [ ] All pages can access auth state

---

SPEC_FILE: /specs/features/auth-context.yml
GOOD_EXAMPLES: /src/contexts/cart-context.tsx
TARGET_FILES: /src/contexts/auth-context.tsx
```

**Priority:** High
**Category:** Authentication

---

#### TASK-007: Protected Routes Middleware
**Subject:** `[AUTO] Authentication - Route Protection`

**Description:**
```markdown
## Feature Requirements
Protect authenticated routes from unauthorized access. Redirect to login if not authenticated.

## Current Implementation
- middleware.ts checks auth token
- Redirects to /auth/login if missing
- Allows public routes
- Preserves redirect URL after login

## Acceptance Criteria
- [ ] Unauthenticated users redirected to /auth/login
- [ ] After login, redirect to originally requested page
- [ ] Public routes always accessible
- [ ] Protected routes list configured
- [ ] API routes also protected
- [ ] Admin routes check role

---

SPEC_FILE: /specs/features/auth-middleware.yml
GOOD_EXAMPLES: /src/middleware.ts
TARGET_FILES: /src/middleware.ts
```

**Priority:** High
**Category:** Authentication

---

### Module: AI Features (2 tasks)

#### TASK-008: AI Assistant Chat Interface
**Subject:** `[AUTO] AI Assistant - Chat with Dr. Raw`

**Description:**
```markdown
## Feature Requirements
Provide AI-powered chat assistant for raw feeding questions. Stream responses in real-time. Personalize based on user's pets.

## Current Implementation
- Chat interface at /ai-assistant
- POST /api/chat endpoint using OpenAI GPT-4o-mini
- Streaming responses via AI SDK
- Rate limiting (10 requests/minute)
- Pet context included in prompts
- Dr. Raw system prompt with expertise

## Technical Requirements
- Stream text responses using AI SDK streamText()
- Include user's pets in system prompt
- Rate limit per user (10 req/min)
- Sanitize user input (XSS prevention)
- Handle API errors gracefully
- Show loading states
- Auto-scroll to latest message

## Acceptance Criteria
- [ ] User can send messages
- [ ] Responses stream word-by-word
- [ ] AI knows user's pets (Max, Luna, etc.)
- [ ] Chat history persists during session
- [ ] Dark text visible on light background
- [ ] Rate limit shows helpful error
- [ ] Loading spinner during stream
- [ ] Auto-scrolls to latest message
- [ ] Copy message button works
- [ ] Regenerate response button works
- [ ] Works on mobile devices
- [ ] Pet context updates when pets change

## API Contract

### Request
```json
{
  "messages": [
    {"role": "user", "content": "What should I feed my cat?"}
  ],
  "pets": [
    {"name": "Luna", "species": "cat", "breed": "Siamese", "weight": 10}
  ]
}
```

### Response (Streaming)
```
Hello! For Luna, your 10-pound Siamese cat, I recommend...
```

---

SPEC_FILE: /specs/features/ai-assistant-chat.yml
GOOD_EXAMPLES: /src/app/ai-assistant/page.tsx, /src/app/api/chat/route.ts
TARGET_FILES: /src/app/ai-assistant/page.tsx, /src/app/api/chat/route.ts

---

## Testing Instructions
1. Navigate to /ai-assistant
2. Ensure you have pets added to profile
3. Send message: "What should I feed Max?"
4. Verify AI mentions Max by name
5. Verify response streams in real-time
6. Verify text is dark and visible
7. Send 10+ messages to test rate limit
8. Test copy message button
9. Test on mobile viewport
10. Check error handling (disconnect network)
```

**Priority:** High
**Status:** In Progress (Text color fixed)
**Category:** AI Features

---

#### TASK-009: AI Chat Usage Tracking
**Subject:** `[AUTO] AI Assistant - Usage Analytics`

**Description:**
```markdown
## Feature Requirements
Track AI chat usage for monitoring and billing purposes.

## Current Implementation
- GET /api/chat/usage endpoint
- Tracks: message count, tokens used, timestamp
- Usage limits by user tier

## Acceptance Criteria
- [ ] Track messages sent per user
- [ ] Track tokens consumed
- [ ] Track API costs
- [ ] Admin can view usage dashboard
- [ ] Users see their usage stats
- [ ] Warn users approaching limits
- [ ] Enforce usage limits

---

SPEC_FILE: /specs/features/ai-usage-tracking.yml
GOOD_EXAMPLES: /src/app/api/chat/route.ts
TARGET_FILES: /src/app/api/chat/usage/route.ts, /src/app/admin/page.tsx
```

**Priority:** Low
**Category:** AI Features

---

### Module: Shopping Cart & E-commerce (12 tasks)

#### TASK-010: Shopping Cart Management
**Subject:** `[AUTO] Shop - Shopping Cart Full CRUD`

**Description:**
```markdown
## Feature Requirements
Full shopping cart functionality: add, update quantity, remove items. Persist across sessions.

## Current Implementation
- Cart page at /cart
- CartContext for global state
- POST /api/cart (add item)
- GET /api/cart (fetch cart)
- PATCH /api/cart (update quantity)
- DELETE /api/cart (remove item)
- Vercel KV storage with in-memory fallback

## Acceptance Criteria
- [ ] User can view cart at /cart
- [ ] Cart shows all items with: image, name, size, price, quantity
- [ ] User can update quantity (+ / - buttons)
- [ ] User can remove items (X button)
- [ ] Cart total calculates correctly
- [ ] Subtotal + shipping + tax shown
- [ ] Empty cart state with "Continue Shopping" button
- [ ] Cart badge in header shows item count
- [ ] Cart persists across page refreshes
- [ ] Cart persists across browser sessions
- [ ] Loading states during API calls
- [ ] Optimistic UI updates
- [ ] Offline: Uses in-memory fallback
- [ ] Works on mobile

## API Contract

### Add Item (POST /api/cart)
```json
{
  "productId": "prod_123",
  "quantity": 2,
  "size": "1lb"
}
```

### Update Item (PATCH /api/cart)
```json
{
  "productId": "prod_123",
  "quantity": 3
}
```

---

SPEC_FILE: /specs/features/shop-cart.yml
GOOD_EXAMPLES: /src/app/wishlist/page.tsx, /src/contexts/cart-context.tsx
TARGET_FILES: /src/app/cart/page.tsx, /src/app/api/cart/route.ts, /src/contexts/cart-context.tsx

---

## Testing Instructions
1. Add products from /shop
2. Navigate to /cart
3. Verify all items display correctly
4. Update quantities using +/- buttons
5. Remove an item
6. Verify total updates correctly
7. Refresh page (cart should persist)
8. Close browser, reopen (cart should persist)
9. Test with 20+ items
10. Test offline (should use fallback)
```

**Priority:** High
**Status:** Ready for Review (Implemented)
**Category:** Shop

---

**[Continuing with remaining 80+ tasks...]**

This document will be **very large** with all tasks. Should I:

1. **Continue adding ALL 90+ tasks to this document** (will be ~20,000 lines)
2. **Split into separate files by module** (auth.md, shop.md, community.md, etc.)
3. **Generate actual CSV file** for direct OpenProject import
4. **Create a summary with just 30 most critical tasks** to start with

Which approach would you prefer? I can definitely do all of them - just want to optimize for what you'll actually use! 🎯
