# RAWGLE - Raw Pet Food Community Platform

A comprehensive platform for raw pet food enthusiasts built with Next.js 15, React 19, and TypeScript.

## Features

- 🤖 **AI Pet Nutritionist** - Get expert answers on raw feeding using GPT-4o-mini
- 🐕 **Pet Management** - Track multiple pets with detailed profiles
- 🍖 **Smart Feeding Tracker** - Schedule meals with ingredients and supplements
- 🏥 **Health & Wellness** - Monitor vaccinations, vet visits, and health records
- 💊 **Medication Tracker** - Never miss a dose with medication reminders
- 📍 **Supplier Locator** - Find raw food suppliers near you
- 👥 **Community** - Connect with other raw feeding enthusiasts

## Quick Start

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- OpenAI API key (for AI Assistant feature)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rawgle-frontend.git
   cd rawgle-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Edit `.env.local` and add your OpenAI API key:
   ```bash
   # OpenAI Configuration
   # Add your OpenAI API key here for the AI Assistant feature
   # Get your key from: https://platform.openai.com/api-keys
   OPENAI_API_KEY=sk-your-key-here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Required

- `OPENAI_API_KEY` - Your OpenAI API key for the AI Assistant
  - Get one at: https://platform.openai.com/api-keys
  - The AI Assistant will show setup instructions if this is missing

### Optional

- `NEXT_PUBLIC_RAWGLE_API_URL` - API URL (default: https://rawgle.com/api)
- `NEXT_PUBLIC_APP_NAME` - Application name (default: RAWGLE)
- `NEXT_PUBLIC_APP_URL` - Full app URL for meta tags

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### Project Structure

```
src/
├── app/                    # Next.js 15 App Router pages
│   ├── ai-assistant/      # AI chat interface
│   ├── api/               # API routes
│   │   ├── chat/         # AI chat endpoint
│   │   ├── feeding/      # Feeding tracker API
│   │   ├── health/       # Health records API
│   │   ├── medications/  # Medications API
│   │   └── pets/         # Pet management API
│   ├── feeding/           # Feeding tracker
│   ├── health/            # Health records
│   ├── medications/       # Medication tracker
│   ├── pets/              # Pet management
│   └── ...
├── components/            # Reusable React components
│   ├── feeding/          # Feeding-related components
│   ├── health/           # Health-related components
│   ├── navigation/       # Navigation components
│   └── ui/               # UI primitives (shadcn/ui)
├── lib/                  # Utility functions and constants
│   ├── constants/        # App constants (food types, supplements)
│   └── utils.ts          # Helper functions
└── styles/               # Global styles
```

### Tech Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5.7.3
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.0.14
- **AI**: Vercel AI SDK 5.0.76 with OpenAI
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Map**: Mapbox GL

### Key Dependencies

```json
{
  "next": "15.5.6",
  "react": "19.2.0",
  "typescript": "5.7.3",
  "tailwindcss": "4.0.14",
  "ai": "5.0.76",
  "@ai-sdk/openai": "1.0.14"
}
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   - In Vercel project settings
   - Go to Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your OpenAI key
   - Select Production, Preview, and Development environments
   - Add any other optional variables

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Every push to main triggers a new deployment

### Pre-Deployment Checklist

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide.

**Quick checks:**
- ✅ Run `npm run build` successfully
- ✅ All environment variables configured in Vercel
- ✅ Test AI Assistant works with API key
- ✅ No TypeScript errors
- ✅ All features tested locally

## Features Overview

### AI Pet Nutritionist

Powered by GPT-4o-mini, the AI assistant provides:
- Raw feeding advice and principles
- Portion calculations based on pet weight
- Food safety guidance
- Meal planning suggestions
- Transition support from kibble to raw

**Note**: Requires `OPENAI_API_KEY` environment variable. Will display setup instructions if missing.

### Feeding Tracker

- Create feeding schedules with multiple ingredients
- Add supplements separately (visually distinguished with green badges)
- Track actual feedings with timestamps
- View feeding history by day/week/month
- Auto-generate meals from schedules
- 15 predefined food types (Beef, Chicken, Salmon, etc.)
- 15 predefined supplements (Omega-3, Probiotics, etc.)

### Pet Management

- Multiple pet profiles
- Track species, breed, weight, age
- Upload pet photos
- Mark pets as active/inactive
- View all pet-related data in one place

### Health & Wellness

- Track vaccinations and vet visits
- Monitor weight trends
- Record health observations
- Set reminders for checkups

### Medication Tracker

- Add medications with dosage
- Set frequency and reminders
- Mark doses as taken
- View medication history

## Troubleshooting

### AI Assistant not responding

**Problem**: Chat doesn't respond or shows error

**Solution**:
1. Check `OPENAI_API_KEY` is set in `.env.local`
2. Verify API key is valid at https://platform.openai.com
3. Check browser console for errors
4. Restart dev server: `npm run dev`

### Build fails

**Problem**: `npm run build` fails with errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### TypeScript errors

**Problem**: Type errors during development

**Solution**:
```bash
# Update type definitions
npm install --save-dev @types/react@latest @types/node@latest
```

### Port already in use

**Problem**: Port 3000 is already in use

**Solution**:
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Feeding schedules not saving

**Problem**: Schedules disappear on dev server restart

**Note**: This is expected behavior in development. The app uses in-memory storage with global persistence that survives HMR but not full server restarts. In production with a real database, this won't be an issue.

### Console Errors: PWA Icons 404

**Problem**: Browser console shows 404 errors for `icon-192.png`, `icon-512.png`, `icon-144x144.png`

**Status**: These are harmless warnings during PWA manifest validation. The icon files exist and load correctly when needed by the PWA system. You can safely ignore these console messages.

**Why it happens**: Next.js PWA plugin validates multiple icon paths during manifest generation. The icons are actually present in the `/public` folder and function correctly.

### Console: WireframeIt Script

**Problem**: Console shows `[WIREFRAMEIT] - Content Core Script loaded`

**Status**: This is from a browser extension or developer tool, not from the Rawgle app. It's injected by your browser and can be safely ignored.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linter
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style
- Add comments for complex logic
- Test all features before submitting
- Update documentation if needed
- Run `npm run build` to verify no errors

## Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

## Support

For issues and questions:
- Open a GitHub issue
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review error logs in browser console and Vercel dashboard

## License

This project is proprietary and confidential.

---

**Built with ❤️ for the raw pet food community**

Last updated: 2025-10-21
