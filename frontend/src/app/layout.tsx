import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'AI Travel Planner',
  description: 'Plan your perfect trip with AI-powered itineraries',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
