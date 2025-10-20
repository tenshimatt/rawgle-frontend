# RAWGLE - Production Deployment & Infrastructure Plan

**Created**: 2025-10-20
**Status**: Implementation Guide

---

## DEPLOYMENT STRATEGY

### Phase 1: Deploy to Cloudflare Pages (NOW)

#### 1.1 Build Configuration
Create `wrangler.toml` for Pages deployment:

```toml
name = "rawgle-frontend"
compatibility_date = "2024-03-08"

[build]
command = "npm run build"
cwd = "/Users/mattwright/pandora/rawgle-frontend"

[build.upload]
format = "directory"
dir = "out"

[[pages_build_output_dir]]
directory = ".next"

[env.production.vars]
NEXT_PUBLIC_RAWGLE_API_URL = "https://rawgle.com/api"
NEXT_PUBLIC_APP_URL = "https://dev.rawgle.com"

[env.preview.vars]
NEXT_PUBLIC_RAWGLE_API_URL = "https://rawgle.com/api"
NEXT_PUBLIC_APP_URL = "https://preview.rawgle.com"
```

#### 1.2 Next.js Configuration
Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for Cloudflare Pages
  images: {
    unoptimized: true, // Cloudflare Pages doesn't support Image Optimization
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

#### 1.3 Package.json Scripts
Add build scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "npm run build && wrangler pages deploy .next",
    "deploy:production": "npm run build && wrangler pages deploy .next --project-name=rawgle-frontend --branch=main",
    "deploy:preview": "npm run build && wrangler pages deploy .next --project-name=rawgle-frontend --branch=preview"
  }
}
```

#### 1.4 Deployment Commands

```bash
# One-time setup
cd /Users/mattwright/pandora/rawgle-frontend
wrangler pages project create rawgle-frontend

# Deploy to production (dev.rawgle.com)
npm run build
wrangler pages deploy .next --project-name=rawgle-frontend --branch=main

# Configure custom domain
wrangler pages domains add dev.rawgle.com --project-name=rawgle-frontend
```

#### 1.5 Expected Result
- **URL**: https://dev.rawgle.com
- **API**: https://rawgle.com/api (same domain, no CORS)
- **Build Time**: ~2 minutes
- **Deploy Time**: ~30 seconds
- **Auto-deploy**: On git push to main

---

## DOCUMENTATION SYSTEM - BOOKSTACK

### Why Bookstack?
- ✅ Self-hosted (you control the data)
- ✅ Structured (Shelves → Books → Chapters → Pages)
- ✅ MCP integration available
- ✅ Version control
- ✅ Team collaboration
- ✅ Search functionality
- ✅ API access

### Bookstack Structure for Rawgle

```
📚 Rawgle Platform (Shelf)
  │
  ├── 📖 Architecture & Design (Book)
  │   ├── 📄 System Architecture Overview
  │   ├── 📄 Database Schema & ERD
  │   ├── 📄 API Design & Endpoints
  │   ├── 📄 Frontend Architecture
  │   └── 📄 Infrastructure Map
  │
  ├── 📖 Development Guide (Book)
  │   ├── 📑 Setup & Installation (Chapter)
  │   │   ├── 📄 Local Development Setup
  │   │   ├── 📄 Environment Variables
  │   │   └── 📄 Dependencies & Tools
  │   ├── 📑 Coding Standards (Chapter)
  │   │   ├── 📄 TypeScript Guidelines
  │   │   ├── 📄 React Best Practices
  │   │   └── 📄 API Conventions
  │   └── 📑 Testing (Chapter)
  │       ├── 📄 Unit Testing
  │       ├── 📄 Integration Testing
  │       └── 📄 E2E Testing
  │
  ├── 📖 Deployment & Operations (Book)
  │   ├── 📄 Deployment Process
  │   ├── 📄 CI/CD Pipeline
  │   ├── 📄 Environment Management
  │   ├── 📄 Monitoring & Logging
  │   └── 📄 Rollback Procedures
  │
  ├── 📖 API Documentation (Book)
  │   ├── 📄 Authentication
  │   ├── 📄 Supplier Endpoints
  │   ├── 📄 Pet Management
  │   ├── 📄 Feeding Logs
  │   ├── 📄 Community Features
  │   └── 📄 PAWS Token System
  │
  ├── 📖 Feature Specifications (Book)
  │   ├── 📄 Supplier Search & Map
  │   ├── 📄 Pet Health Tracking
  │   ├── 📄 Feeding Calculator
  │   ├── 📄 Community Discussion
  │   ├── 📄 AI Recommendations
  │   └── 📄 NFT Minting
  │
  └── 📖 Project Management (Book)
      ├── 📄 Current Sprint (Active Tasks)
      ├── 📄 Backlog & Roadmap
      ├── 📄 Bug Tracking
      ├── 📄 Technical Debt
      └── 📄 Meeting Notes
```

### Using Bookstack MCP

The Bookstack MCP server is already available. Use it to:

1. **Search Documentation**
```javascript
// Find pages about deployment
mcp__bookstack__search_pages({
  query: "deployment",
  count: 10
})
```

2. **Update Pages**
```javascript
// Update deployment documentation
mcp__bookstack__update_page({
  page_id: 123,
  content: "# New Deployment Process...",
  name: "Deployment Process"
})
```

3. **Create Pages**
```javascript
// Create new feature spec
mcp__bookstack__create_page({
  book_id: 5,
  chapter_id: 12,
  name: "Supplier Detail Page",
  content: "# Supplier Detail Page Spec..."
})
```

### Migration from Local Files to Bookstack

**Current Local Files**:
- `/Users/mattwright/pandora/rawgle-frontend/STATUS_REPORT.md`
- `/Users/mattwright/pandora/rawgle-frontend/WORKING_NOW.md`
- `/Users/mattwright/pandora/rawgle-frontend/INTEGRATION_COMPLETE.md`
- `/Users/mattwright/pandora/rawgle-frontend/DEPLOYMENT_AND_INFRASTRUCTURE.md`

**Bookstack Migration**:
1. Create "Development Sessions" book
2. Create pages for each status report
3. Tag with: date, sprint, developer
4. Link related pages
5. Archive old reports

---

## CI/CD PIPELINE - GITHUB ACTIONS

### Workflow File: `.github/workflows/deploy.yml`

```yaml
name: Deploy Rawgle Frontend

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

env:
  NODE_VERSION: '20'
  CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
  CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npx tsc --noEmit

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    name: Build Application
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js
        run: npm run build
        env:
          NEXT_PUBLIC_RAWGLE_API_URL: https://rawgle.com/api

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: next-build
          path: .next
          retention-days: 1

  deploy-preview:
    name: Deploy Preview
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: next-build
          path: .next

      - name: Deploy to Cloudflare Pages (Preview)
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .next --project-name=rawgle-frontend --branch=preview

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deployed to: https://preview.rawgle.com'
            })

  deploy-production:
    name: Deploy to Production
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: production
      url: https://dev.rawgle.com
    steps:
      - uses: actions/checkout@v4

      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: next-build
          path: .next

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .next --project-name=rawgle-frontend --branch=main

      - name: Update Bookstack
        run: |
          curl -X POST https://bookstack.rawgle.com/api/pages \
            -H "Authorization: Token ${{ secrets.BOOKSTACK_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{
              "book_id": 1,
              "name": "Deployment Log - ${{ github.run_number }}",
              "markdown": "# Deployment\n\n**Date**: ${{ github.event.head_commit.timestamp }}\n**Commit**: ${{ github.sha }}\n**Author**: ${{ github.actor }}\n**Branch**: main\n**Status**: Success\n**URL**: https://dev.rawgle.com"
            }'

      - name: Notify team
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "✅ Rawgle deployed to production",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Rawgle Frontend Deployed*\n\n*Environment:* Production\n*URL:* https://dev.rawgle.com\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}"
                  }
                }
              ]
            }
```

### Required GitHub Secrets

```bash
# Add to GitHub repository settings
CLOUDFLARE_API_TOKEN=<your-cloudflare-api-token>
CLOUDFLARE_ACCOUNT_ID=<your-cloudflare-account-id>
BOOKSTACK_API_TOKEN=<your-bookstack-api-token>
SLACK_WEBHOOK_URL=<optional-slack-webhook>
```

---

## PROJECT MANAGEMENT - ARCHON ALTERNATIVE

### Option 1: GitHub Projects (Recommended)

**Why**: Native integration, free, automated workflows

**Setup**:
1. Go to https://github.com/tenshimatt/pandora/projects
2. Create "Rawgle Development" project
3. Add columns:
   - 📋 Backlog
   - 🔜 Ready
   - 🏗️ In Progress
   - 👀 Review
   - ✅ Done
   - 🐛 Bugs

**Automation**:
```yaml
# .github/workflows/project-automation.yml
name: Project Board Automation

on:
  issues:
    types: [opened, closed, reopened]
  pull_request:
    types: [opened, closed, reopened, ready_for_review]

jobs:
  add_to_project:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/<org>/projects/<project-number>
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Option 2: Linear (Best Alternative to Archon)

**Why**: Purpose-built for engineering teams, Git integration

**Features**:
- Sprint planning
- Issue tracking
- Roadmap visualization
- Git integration
- API access
- Slack integration

**Setup**:
```bash
# Install Linear CLI
npm install -g @linear/cli

# Connect to GitHub
linear team settings integrations github
```

### Option 3: ClickUp (Full Project Management)

**Why**: Most comprehensive, replaces Archon entirely

**Features**:
- Tasks, docs, wikis, goals
- Time tracking
- Gantt charts
- Custom fields
- API + webhooks

---

## RECOMMENDED WORKFLOW

### Daily Development

1. **Check Bookstack** for current sprint tasks
2. **Create feature branch**: `git checkout -b feature/supplier-detail-page`
3. **Code** with documentation in mind
4. **Update Bookstack** with implementation notes
5. **Commit** with conventional commits:
   ```bash
   git commit -m "feat(suppliers): add detail page component"
   ```
6. **Push** and create PR
7. **GitHub Actions** runs tests + deploys preview
8. **Review** preview at https://preview-{pr}.rawgle.com
9. **Merge** to main
10. **Auto-deploy** to https://dev.rawgle.com
11. **Bookstack** auto-updated with deployment log

### Weekly Sprint

1. **Monday**: Sprint planning in GitHub Projects
2. **Daily**: Standup + update Bookstack
3. **Wednesday**: Mid-sprint review
4. **Friday**: Deploy to production, retrospective

---

## IMMEDIATE ACTION PLAN

### Step 1: Deploy Frontend (15 minutes)

```bash
cd /Users/mattwright/pandora/rawgle-frontend

# Update next.config.js for static export
cat > next.config.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
EOF

# Build
npm run build

# Deploy to Cloudflare Pages
wrangler pages project create rawgle-frontend
wrangler pages deploy out --project-name=rawgle-frontend --branch=main

# Add custom domain
wrangler pages domains add dev.rawgle.com --project-name=rawgle-frontend
```

### Step 2: Setup GitHub Actions (10 minutes)

```bash
# Create workflow directory
mkdir -p .github/workflows

# Copy the deploy.yml content from above

# Commit and push
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deployment workflow"
git push origin main
```

### Step 3: Setup Bookstack (20 minutes)

```bash
# Option A: Use existing Bookstack instance
# Login to your Bookstack at bookstack.rawgle.com
# Create API token in settings

# Option B: Deploy new Bookstack
docker run -d \
  -p 8080:80 \
  -e APP_URL=https://bookstack.rawgle.com \
  -e DB_HOST=db \
  -e DB_USER=bookstack \
  -e DB_PASS=secret \
  --name=bookstack \
  solidnerd/bookstack:latest
```

### Step 4: Migrate Documentation (30 minutes)

Use the Bookstack MCP to create initial structure and migrate existing docs.

---

## SUCCESS CRITERIA

### Week 1: Infrastructure
- [ ] Frontend deployed to dev.rawgle.com
- [ ] GitHub Actions running
- [ ] Bookstack structure created
- [ ] First deployment documented

### Week 2: Workflow
- [ ] Team using Bookstack daily
- [ ] All features documented before coding
- [ ] Auto-deploy working
- [ ] No local-only documentation

### Week 3: Optimization
- [ ] Build time <2 minutes
- [ ] Deploy time <30 seconds
- [ ] Test coverage >80%
- [ ] Documentation complete

---

## AVOIDING BLACK BOX

### Transparency Measures

1. **All decisions in Bookstack** - No tribal knowledge
2. **All code in Git** - Full history
3. **All deployments logged** - Automated documentation
4. **All tasks in GitHub Projects** - Visible progress
5. **All discussions in GitHub Issues** - Searchable
6. **All changes in PRs** - Reviewable

### Knowledge Transfer

1. **Architecture Decision Records (ADRs)** in Bookstack
2. **Weekly summaries** auto-generated from commits
3. **Deployment logs** with before/after screenshots
4. **API changelog** auto-generated from code
5. **Onboarding docs** for new team members

---

This is how we **BUILD AND DELIVER** the product systematically.
