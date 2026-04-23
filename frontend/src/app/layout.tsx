import React from 'react';
import '../index.css';
import { ClientProviders } from '../components/ClientProviders';

export const metadata = {
  metadataBase: new URL('https://www.drivedeal.tech'),
  title: {
    default: 'DriveDeal - Premium Used Cars in Karnataka & India',
    template: '%s | DriveDeal'
  },
  description: 'Find high-quality, verified used cars in Karnataka and across India. Browse our premium selection of second-hand vehicles with transparent pricing.',
  keywords: ['used cars', 'second hand cars', 'used cars in Karnataka', 'second hand cars in India', 'premium used cars', 'verified cars', 'buy used cars'],
  authors: [{ name: 'DriveDeal' }],
  creator: 'DriveDeal',
  publisher: 'DriveDeal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.drivedeal.tech',
    siteName: 'DriveDeal',
    title: 'DriveDeal - Premium Used Cars in Karnataka & India',
    description: 'Find high-quality, verified used cars in Karnataka and across India. Browse our premium selection of second-hand vehicles.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&h=630&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'DriveDeal Premium Used Cars',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DriveDeal - Premium Used Cars in Karnataka & India',
    description: 'Find high-quality, verified used cars in Karnataka and across India.',
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&h=630&auto=format&fit=crop'],
  },
  verification: {
    google: '0C1GuFt8t-4-wwNVNo8NcokOLAsxsk5xuTQY3os4OMo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

