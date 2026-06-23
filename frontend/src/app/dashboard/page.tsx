'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { Trip } from '@/types';
import CreateTripForm from '@/components/CreateTripForm';
import ItineraryCard from '@/components/ItineraryCard';
import PackingList from '@/components/PackingList';

export default function Dashboard() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingTrip, setCreatingTrip] = useState(false);

  // Authenticate user check and retrieve User Isolation Saved Trips
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUserTrips();
  }, [router]);

  const fetchUserTrips = async () => {
    try {
      const response = await api.get('/trips');
      setTrips(response.data);
      if (response.data.length > 0) {
        setSelectedTrip(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch trips', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTripCreated = (newTrip: Trip) => {
    setTrips([newTrip, ...trips]);
    setSelectedTrip(newTrip);
  };

  const handleTripUpdate = (updatedTrip: Trip) => {
    setTrips(trips.map((t) => (t._id === updatedTrip._id ? updatedTrip : t)));
    setSelectedTrip(updatedTrip);
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    try {
      await api.delete(`/trips/${tripId}`);
      const newTrips = trips.filter((t) => t._id !== tripId);
      setTrips(newTrips);
      if (selectedTrip?._id === tripId) {
        setSelectedTrip(newTrips.length > 0 ? newTrips[0] : null);
      }
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4 mx-auto"></div>
          <p className="text-lg animate-pulse">Loading secure user vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center border-b border-slate-800 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            AI Travel Dashboard
          </h1>
          <p className="text-sm text-slate-400">User Data Enclave Connected</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}
          className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Sign Out
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <CreateTripForm onTripCreated={handleTripCreated} isLoading={creatingTrip} />

          {/* Trip Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Your Active Trips ({trips.length})</h2>
            {trips.length === 0 ? (
              <p className="text-slate-500 text-sm">No itineraries found. Create one to begin!</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {trips.map((trip) => (
                  <div
                    key={trip._id}
                    className={`p-3 rounded-xl transition border cursor-pointer group ${
                      selectedTrip?._id === trip._id
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedTrip(trip)}
                      className="w-full text-left"
                    >
                      <p className="font-bold">{trip.destination}</p>
                      <p className="text-xs opacity-80">{trip.durationDays} Days • {trip.budgetTier} Budget</p>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTrip(trip._id);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition mt-1"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget Ledger */}
          {selectedTrip && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Financial Cost Ledger</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Lodging & Accommodations:</span>
                  <span className="font-semibold">${selectedTrip.estimatedBudget.accommodation.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Culinary & Dining:</span>
                  <span className="font-semibold">${selectedTrip.estimatedBudget.food.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Activities & Sightseeing:</span>
                  <span className="font-semibold">${selectedTrip.estimatedBudget.activities.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Transportation:</span>
                  <span className="font-semibold">${selectedTrip.estimatedBudget.transport.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-800 pt-3 text-white font-bold">
                  <span>Grand Total Estimated Budget:</span>
                  <span>${selectedTrip.estimatedBudget.total.toFixed(0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTrip ? (
            <>
              <ItineraryCard trip={selectedTrip} onUpdate={handleTripUpdate} />
              <PackingList trip={selectedTrip} onUpdate={handleTripUpdate} />
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-96 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-6xl mb-4">✈️</span>
              <p className="text-slate-400">Select an existing itinerary or create a new trip to begin exploring.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
