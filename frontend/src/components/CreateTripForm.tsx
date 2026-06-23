'use client';

import React, { useState } from 'react';
import api from '@/utils/api';
import { Trip } from '@/types';

interface CreateTripFormProps {
  onTripCreated: (trip: Trip) => void;
  isLoading: boolean;
}

export default function CreateTripForm({ onTripCreated, isLoading }: CreateTripFormProps) {
  const [destination, setDestination] = useState('');
  const [durationDays, setDurationDays] = useState(5);
  const [budgetTier, setBudgetTier] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const interestArray = interests
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      const response = await api.post('/trips', {
        destination,
        durationDays: parseInt(durationDays.toString()),
        budgetTier,
        interests: interestArray,
      });

      onTripCreated(response.data);
      setDestination('');
      setDurationDays(5);
      setBudgetTier('Medium');
      setInterests('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4 text-white">Create New Trip</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Tokyo, Paris, New York"
            required
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Duration (Days)
            </label>
            <input
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
              min="1"
              max="30"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Budget Tier
            </label>
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value as 'Low' | 'Medium' | 'High')}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Interests (comma-separated)
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., hiking, food, culture, beach"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading || isLoading}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg transition"
        >
          {loading || isLoading ? 'Generating AI Trip...' : 'Generate AI Trip'}
        </button>
      </form>
    </div>
  );
}
