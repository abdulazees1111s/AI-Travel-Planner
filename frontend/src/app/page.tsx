'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            ✈️ AI Travel Planner
          </div>
          <div className="space-x-4">
            <Link href="/login" className="text-slate-300 hover:text-white transition">
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center max-w-7xl mx-auto w-full px-6 py-20">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Plan Your Perfect Trip
            </span>
          </h1>

          <p className="text-xl text-slate-400">
            Powered by AI. Personalized for you. Create detailed, day-by-day itineraries in seconds.
          </p>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🤖</span>
              <p>AI-generated itineraries tailored to your interests and budget</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💼</span>
              <p>Smart packing assistant that considers destination weather</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">✏️</span>
              <p>Edit and customize every aspect of your travel plan</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💾</span>
              <p>Save multiple trips and access them anytime, anywhere</p>
            </div>
          </div>

          <Link
            href="/register"
            className="inline-block mt-8 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>&copy; 2024 AI Travel Planner. Built with Next.js, Express, and Gemini API.</p>
        </div>
      </footer>
    </div>
  );
}
