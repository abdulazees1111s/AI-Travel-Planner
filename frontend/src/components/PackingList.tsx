'use client';

import React, { useState } from 'react';
import { Trip, PackingItem } from '@/types';
import api from '@/utils/api';

interface PackingListProps {
  trip: Trip;
  onUpdate: (updatedTrip: Trip) => void;
}

export default function PackingList({ trip, onUpdate }: PackingListProps) {
  const [loading, setLoading] = useState(false);

  const togglePackingItem = async (itemId: string | undefined) => {
    if (!itemId) return;

    setLoading(true);
    try {
      const updatedPacking = trip.packingList.map((item) => {
        if (item._id === itemId) {
          return { ...item, isPacked: !item.isPacked };
        }
        return item;
      });

      const response = await api.put(`/trips/${trip._id}`, { packingList: updatedPacking });
      onUpdate(response.data);
    } catch (error) {
      console.error('Failed to update packing item:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group packing items by category
  const groupedItems = trip.packingList.reduce(
    (acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as { [key: string]: PackingItem[] }
  );

  const categoryIcons: { [key: string]: string } = {
    Documents: '📄',
    Clothing: '👕',
    Gear: '🎒',
    Other: '📦',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-1 text-white">
        ⛈️ AI Weather-Aware Packing Assistant
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        Based on your active planned locations and local forecasted climate, pack these items:
      </p>

      <div className="space-y-5">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
              <span className="mr-2">{categoryIcons[category] || '📦'}</span>
              {category}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  onClick={() => togglePackingItem(item._id)}
                  className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-750 transition"
                >
                  <input
                    type="checkbox"
                    checked={item.isPacked}
                    readOnly
                    disabled={loading}
                    className="h-4 w-4 rounded bg-slate-950 border-slate-800 accent-emerald-500 cursor-pointer disabled:opacity-50"
                  />
                  <span
                    className={`text-sm flex-1 ${
                      item.isPacked ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {item.item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {trip.packingList.length === 0 && (
        <p className="text-xs text-slate-500 text-center py-6">
          Generating personalized packing checklist...
        </p>
      )}
    </div>
  );
}
