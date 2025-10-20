# RAWGLE Frontend - Next.js 14 + Cloudflare Pages

## 🐾 Overview

RAWGLE is a comprehensive raw pet food community platform built with Next.js 14, Tailwind CSS, and deployed on Cloudflare Pages. Features include feeding tracking, community engagement, PAWS token rewards on Solana, and AI-powered nutrition assistance.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

### Local Development

1. **Clone and Install**
```bash
cd rawgle-frontend
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

3. **Run Development Server**
```bash
npm run dev
# Open http://localhost:3000
```

## 📦 Deployment to Cloudflare Pages

### Option 1: Direct Deployment (Recommended)

1. **Build for Cloudflare Pages**
```bash
npm run pages:build
```

2. **Deploy to Cloudflare**
```bash
# First time - login to Cloudflare
wrangler login

# Deploy to production
npm run deploy
```

3. **Access your site**
```
https://rawgle-frontend.pages.dev
# or your custom domain
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Configure build settings:
   - Build command: `npm run pages:build`
   - Build output: `.vercel/output/static`
   - Node version: `18`

### Option 3: Vercel Deployment (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🏗️ Project Structure

```
rawgle-frontend/
├── src/
│   ├── app/              # Next.js 14 app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── home/        # Homepage components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/      # Layout components
│   │   ├── chat/        # AI chat widget
│   │   └── wallet/      # Solana wallet
│   ├── lib/             # Utilities
│   ├── hooks/           # Custom hooks
│   ├── store/           # Zustand stores
│   └── types/           # TypeScript types
├── public/              # Static assets
├── wrangler.toml        # Cloudflare config
└── next.config.js       # Next.js config
```

## 🔧 Configuration

### Cloudflare Services Setup

1. **KV Namespace** (for session storage)
```bash
wrangler kv:namespace create "RAWGLE_KV"
# Add the ID to wrangler.toml
```

2. **R2 Bucket** (for file storage)
```bash
wrangler r2 bucket create rawgle-assets
```

3. **Durable Objects** (for real-time features)
```bash
# Configure in wrangler.toml
```

### Environment Variables

Key variables to configure:

- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_SOLANA_NETWORK` - Solana network (devnet/mainnet)
- `CF_ACCOUNT_ID` - Cloudflare account ID
- `NEXTAUTH_SECRET` - Authentication secret

## 🎨 Features Implemented

### ✅ Completed
- [x] Landing page with hero, features, testimonials
- [x] Responsive navigation with mobile menu
- [x] Dark mode support
- [x] PAWS token section
- [x] AI chat widget
- [x] Wallet integration (Phantom, Solflare)
- [x] PWA manifest
- [x] SEO optimization
- [x] Animations with Framer Motion

### 🚧 In Progress
- [ ] Authentication flow (login/register)
- [ ] Dashboard pages
- [ ] Feeding tracker
- [ ] Community features
- [ ] Store locator with maps
- [ ] E-commerce integration

### 📝 TODO
- [ ] Complete all dashboard routes
- [ ] Implement API connections
- [ ] Add real-time features with Durable Objects
- [ ] Set up payment processing
- [ ] Create admin panel

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Animations**: Framer Motion
- **Blockchain**: Solana Web3.js
- **Deployment**: Cloudflare Pages
- **Edge Functions**: Cloudflare Workers
- **Storage**: Cloudflare KV + R2
- **Real-time**: Cloudflare Durable Objects

## 📱 PWA Features

The app is PWA-ready with:
- Offline support
- Install prompts
- Push notifications (coming soon)
- App shortcuts
- Splash screens

## 🔐 Security

- CSP headers configured
- XSS protection
- CSRF protection
- Rate limiting via Cloudflare
- Input validation with Zod

## 📊 Performance

Target metrics:
- Lighthouse Score: 95+
- FCP: < 1.5s
- TTI: < 3.5s
- CLS: < 0.1

## 🧪 Testing

```bash
# Run tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache
rm -rf .next .vercel node_modules
npm install
npm run build
```

### Cloudflare Deployment
```bash
# Check deployment status
wrangler pages deployment list --project-name=rawgle-frontend

# View logs
wrangler pages deployment tail --project-name=rawgle-frontend
```

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 💬 Support

- Email: support@rawgle.com
- Discord: [Join our server](https://discord.gg/rawgle)
- Twitter: [@rawgle](https://twitter.com/rawgle)

## 🎯 Deployment Checklist

- [ ] Environment variables configured
- [ ] Cloudflare KV namespace created
- [ ] R2 bucket configured
- [ ] Custom domain setup
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Error tracking setup
- [ ] Monitoring enabled
- [ ] Backup strategy defined

---

**Built with ❤️ for the raw pet food community**