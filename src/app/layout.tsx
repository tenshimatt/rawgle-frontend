import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { Providers } from '@/components/providers'
import { CartIcon } from '@/components/cart/cart-icon'
import { MainNav } from '@/components/navigation/main-nav'
import { SearchProvider } from '@/components/search/search-provider'
import './globals.css'
import 'leaflet/dist/leaflet.css'

// Using system fonts for better performance and offline support
const inter = {
  variable: '--font-inter',
  className: 'font-sans'
}

const poppins = {
  variable: '--font-poppins',
  className: 'font-sans'
}

export const metadata: Metadata = {
  title: 'RAWGLE - Raw Pet Food Community',
  description: 'The ultimate platform for raw pet food enthusiasts. Track feeding, find suppliers, connect with community.',
  keywords: 'raw dog food, pet nutrition, raw feeding, BARF diet, pet health, dog supplements',
  authors: [{ name: 'RAWGLE Team' }],
  creator: 'RAWGLE',
  publisher: 'RAWGLE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rawgle.com'),
  openGraph: {
    title: 'RAWGLE - Raw Pet Food Community',
    description: 'The ultimate platform for raw pet food enthusiasts',
    url: 'https://rawgle.com',
    siteName: 'RAWGLE',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAWGLE - Raw Pet Food Community',
    description: 'The ultimate platform for raw pet food enthusiasts',
    images: ['/twitter-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>
          <SearchProvider>
            <MainNav />
            {children}
            <CartIcon />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
          </SearchProvider>
        </Providers>
      </body>
    </html>
  )
}
