'use client';

import React, { useState } from 'react';
import { Trip, Activity } from '@/types';
import api from '@/utils/api';

interface ItineraryCardProps {
  trip: Trip;
  onUpdate: (updatedTrip: Trip) => void;
}

export default function ItineraryCard({ trip, onUpdate }: ItineraryCardProps) {
  const [newActivityNames, setNewActivityNames] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleAddActivity = async (dayNumber: number) => {
    const activityName = newActivityNames[dayNumber];
    if (!activityName?.trim()) return;

    setLoading(true);
    try {
      const updatedItinerary = trip.itinerary.map((day) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            activities: [
              ...day.activities,
              {
                title: activityName,
                description: 'Added by traveler',
                estimatedCostUSD: 0,
                timeOfDay: 'Afternoon',
              },
            ],
          };
        }
        return day;
      });

      const response = await api.put(`/trips/${trip._id}`, { itinerary: updatedItinerary });
      onUpdate(response.data);
      setNewActivityNames({ ...newActivityNames, [dayNumber]: '' });
    } catch (error) {
      console.error('Failed to add activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveActivity = async (dayNumber: number, activityIndex: number) => {
    setLoading(true);
    try {
      const updatedItinerary = trip.itinerary.map((day) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            activities: day.activities.filter((_, index) => index !== activityIndex),
          };
        }
        return day;
      });

      const response = await api.put(`/trips/${trip._id}`, { itinerary: updatedItinerary });
      onUpdate(response.data);
    } catch (error) {
      console.error('Failed to remove activity:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-white border-b border-slate-800 pb-3">
        Day-by-Day Timeline: {trip.destination}
      </h2>

      <div className="space-y-6">
        {trip.itinerary.map((day) => (
          <div key={day.dayNumber} className="border-l-2 border-indigo-500 pl-6 relative">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-indigo-500 rounded-full border-4 border-slate-900" />
            <h3 className="text-lg font-bold text-slate-200 mb-3">Day {day.dayNumber}</h3>

            <div className="space-y-3 mb-4">
              {day.activities.map((activity, index) => (
                <div key={index} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex justify-between items-start group">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-white">{activity.title}</span>
                      <span className="text-xs bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded-full">
                        {activity.timeOfDay}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-1">Est: ${activity.estimatedCostUSD}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveActivity(day.dayNumber, index)}
                    disabled={loading}
                    className="ml-3 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add Activity Inline Form */}
            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                placeholder="Add new activity..."
                value={newActivityNames[day.dayNumber] || ''}
                onChange={(e) => setNewActivityNames({ ...newActivityNames, [day.dayNumber]: e.target.value })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:border-indigo-500 w-full"
              />
              <button
                onClick={() => handleAddActivity(day.dayNumber)}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
