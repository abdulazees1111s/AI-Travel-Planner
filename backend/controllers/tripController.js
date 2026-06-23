import { Trip } from '../models/Trip.js';
import fetch from 'node-fetch';

// Exponential backoff executor for external API resilience
async function fetchWithRetry(url, options, retries = 5, delay = 1000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        // Wait and retry on rate limits
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw new Error(`External API Error: Status Code ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Request failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

const normalizeBudgetTier = (budgetTier) => {
  const tier = (budgetTier || '').toString().trim().toLowerCase();
  if (tier.includes('luxury')) return 'Luxury';
  if (tier.includes('mid')) return 'Mid-range';
  return 'Budget';
};

const estimateBudgetByTier = (budgetTier, durationDays) => {
  const tier = normalizeBudgetTier(budgetTier);
  const costMap = {
    Budget: { transport: 120, accommodation: 60, food: 30, activities: 35 },
    'Mid-range': { transport: 180, accommodation: 120, food: 55, activities: 75 },
    Luxury: { transport: 280, accommodation: 240, food: 110, activities: 180 },
  };
  const base = costMap[tier] || costMap.Budget;
  const transport = base.transport;
  const accommodation = base.accommodation * durationDays;
  const food = base.food * durationDays;
  const activities = base.activities * durationDays;
  return {
    transport,
    accommodation,
    food,
    activities,
    total: transport + accommodation + food + activities,
  };
};

const generateHotelRecommendations = (destination, budgetTier) => {
  const tier = normalizeBudgetTier(budgetTier);
  const hotelNames = {
    Budget: ['City Comfort Inn', 'Traveler’s Stay Hotel', 'Budget Corner Lodge'],
    'Mid-range': ['Horizon Suites', 'Urban Explorer Hotel', 'Comfort Premier'],
    Luxury: ['Grand Vista Resort', 'Skyline Palace Hotel', 'Elite Signature Suites'],
  };
  const selected = hotelNames[tier] || hotelNames.Budget;
  return selected.slice(0, 2).map((name, index) => ({
    name: `${name} in ${destination}`,
    tier,
    estimatedCostNightUSD: tier === 'Luxury' ? 250 + index * 30 : tier === 'Mid-range' ? 140 + index * 20 : 80 + index * 10,
    rating: tier === 'Luxury' ? '5.0/5' : tier === 'Mid-range' ? '4.5/5' : '4.0/5',
  }));
};

const buildPackingList = (destination, interests) => {
  const list = [
    { item: 'Passport or ID', category: 'Documents', isPacked: false },
    { item: 'Travel insurance information', category: 'Documents', isPacked: false },
    { item: 'Phone charger', category: 'Other', isPacked: false },
    { item: 'Comfortable walking shoes', category: 'Clothing', isPacked: false },
    { item: 'Weather-appropriate jacket', category: 'Clothing', isPacked: false },
  ];

  const interestItems = {
    adventure: { item: 'Day pack and water bottle', category: 'Gear', isPacked: false },
    hiking: { item: 'Hiking shoes and trekking poles', category: 'Gear', isPacked: false },
    culture: { item: 'Museum guidebook / city map', category: 'Gear', isPacked: false },
    beach: { item: 'Swimwear and sunscreen', category: 'Clothing', isPacked: false },
    food: { item: 'Portable snacks and water bottle', category: 'Other', isPacked: false },
    relaxation: { item: 'Travel pillow', category: 'Other', isPacked: false },
  };

  interests?.forEach((interest) => {
    const key = interest.toString().toLowerCase();
    Object.keys(interestItems).forEach((tag) => {
      if (key.includes(tag)) {
        const item = interestItems[tag];
        if (!list.some((entry) => entry.item === item.item)) {
          list.push(item);
        }
      }
    });
  });

  return list;
};

const generateLocalTripPlan = (destination, durationDays, budgetTier, interests) => {
  const itinerary = Array.from({ length: durationDays }, (_, index) => {
    const dayNumber = index + 1;
    const defaultActivities = [
      { title: 'City orientation walk', description: `Explore the highlights of ${destination} on foot.`, estimatedCostUSD: 15, timeOfDay: 'Morning' },
      { title: 'Local cuisine discovery', description: 'Taste signature dishes at a popular local restaurant.', estimatedCostUSD: 35, timeOfDay: 'Afternoon' },
      { title: 'Sunset viewpoints', description: `Enjoy scenic views and unwind near ${destination}.`, estimatedCostUSD: 10, timeOfDay: 'Evening' },
    ];

    const interestBasedActivities = interests && interests.length > 0
      ? interests.slice(0, 3).map((interest) => ({
          title: `${interest} experience`,
          description: `Enjoy a curated ${interest} activity while in ${destination}.`,
          estimatedCostUSD: 40,
          timeOfDay: 'Afternoon',
        }))
      : [];

    return {
      dayNumber,
      activities: [
        defaultActivities[index % defaultActivities.length],
        ...(interestBasedActivities.length > 0 && index === 0 ? interestBasedActivities : []),
      ],
    };
  });

  return {
    itinerary,
    hotels: generateHotelRecommendations(destination, budgetTier),
    estimatedBudget: estimateBudgetByTier(budgetTier, durationDays),
    packingList: buildPackingList(destination, interests),
  };
};

export const generateNewTrip = async (req, res) => {
  try {
    const { destination, durationDays, budgetTier, interests } = req.body;
    const userId = req.user.id; // Populated from authentication middleware securely

    // Validate input
    if (!destination || !durationDays || !budgetTier) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const prompt = `
    Create a detailed travel plan for a ${durationDays}-day trip to ${destination}.
    Budget preference is ${budgetTier}. Interests are: ${interests && interests.length > 0 ? interests.join(', ') : 'general tourism'}.

    You must output ONLY a valid JSON object matching this exact structure (no markdown, no extra text):
    {
      "itinerary": [
        {
          "dayNumber": 1,
          "activities": [
            { "title": "Activity name", "description": "Brief text details", "estimatedCostUSD": 20, "timeOfDay": "Morning" }
          ]
        }
      ],
      "hotels": [
        { "name": "Recommended Hotel", "tier": "Budget", "estimatedCostNightUSD": 85, "rating": "4.5/5" }
      ],
      "estimatedBudget": {
        "transport": 120,
        "accommodation": 300,
        "food": 150,
        "activities": 100,
        "total": 670
      },
      "packingList": [
        { "item": "Passport", "category": "Documents", "isPacked": false },
        { "item": "Comfortable walking shoes", "category": "Clothing", "isPacked": false }
      ]
    }

    Make sure:
    1. You generate EXACTLY ${durationDays} days of activities
    2. Estimates match typical realistic local rates for the specified ${budgetTier} budgetTier
    3. Packing items are relevant to ${destination}'s climate and the planned activities
    4. All costs are in USD
    5. Return ONLY the JSON object, nothing else
    `;

    let cleanResult;
    const aiKey = process.env.GEMINI_API_KEY;

    if (aiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${aiKey}`;
        const requestPayload = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        };

        const data = await fetchWithRetry(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload),
        });

        const parsedResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (parsedResponseText) {
          cleanResult = JSON.parse(parsedResponseText);
        }
      } catch (apiError) {
        console.warn('AI generation failed, using local fallback:', apiError.message);
      }
    }

    if (!cleanResult || !cleanResult.itinerary || !Array.isArray(cleanResult.itinerary)) {
      cleanResult = generateLocalTripPlan(destination, durationDays, budgetTier, interests || []);
    }

    const newTrip = new Trip({
      userId,
      destination,
      durationDays,
      budgetTier,
      interests: interests || [],
      itinerary: cleanResult.itinerary,
      hotels: cleanResult.hotels || [],
      estimatedBudget: cleanResult.estimatedBudget || {},
      packingList: cleanResult.packingList || [],
    });

    const savedTrip = await newTrip.save();
    return res.status(201).json(savedTrip);
  } catch (error) {
    console.error('Critical trip creation error:', error.message);
    res.status(500).json({
      message: 'Fail-safe: API encountered an error processing your trip. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const userId = req.user.id;

    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Error fetching trips' });
  }
};

export const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findOne({ _id: tripId, userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ message: 'Error fetching trip' });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const trip = await Trip.findOneAndUpdate(
      { _id: tripId, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(trip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ message: 'Error updating trip' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findOneAndDelete({ _id: tripId, userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ message: 'Error deleting trip' });
  }
};
