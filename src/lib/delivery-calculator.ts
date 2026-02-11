import { CartItem } from '@/types/cart';

// --- CONFIGURATION CONSTANTS ---

export const LGA_DISTANCES: Record<string, number> = {
  'Agege': 32, 'Ajeromi-Ifelodun': 20, 'Alimosho': 21, 'Amuwo-Odofin': 17,
  'Apapa': 26, 'Badagry': 38, 'Epe': 100, 'Eti-Osa': 60,
  'Ibeju-Lekki': 90, 'Ifako-Ijaiye': 40, 'Ikeja': 40, 'Ikorodu': 55,
  'Kosofe': 40, 'Lagos Island': 37, 'Lagos Mainland': 32, 'Mushin': 30,
  'Ojo': 5, 'Oshodi-Isolo': 31, 'Shomolu': 36, 'Surulere': 25,
};

// Load Points: Defines how much space an item takes
// We use 'string' as key to allow for 'default' fallback
const ITEM_POINTS: Record<string, number> = {
  'panel': 12,       // 4 panels = 48 pts
  'battery': 22,     // 2 batteries = 44 pts
  'inverter': 8,     // 1 inverter = 8 pts
  'controller': 1,
  'accessory': 0.5,
  'default': 2       // Fallback for unknown items
};

// Base Pricing Tiers (Standard Cost to Surulere/Mainland)
const PRICING_TIERS = [
  { maxPoints: 10,  cost: 10000 }, // Hand carry
  { maxPoints: 20,  cost: 20000 }, // Bike (Light - 1 panel)
  { maxPoints: 45,  cost: 25000 }, // Bike (Medium - 2 panels)
  { maxPoints: 100, cost: 75000 }  // Bike (Full Load)
];

const COST_PER_FULL_BIKE = 75000;
const BASE_DISTANCE_KM = 25; // Reference distance (Surulere)
const MARKUP_PER_5KM = 2000; // Extra cost per 5km per trip

// --- MAIN FUNCTION ---

export function calculateDeliveryFee(lga: string, cartItems: CartItem[]): number {
  // 1. Calculate Total Load Points
  const totalPoints = cartItems.reduce((sum, item) => {
    // Handle case where category is undefined (default to 'default')
    const categoryKey = item.category || 'default';
    const points = ITEM_POINTS[categoryKey] || ITEM_POINTS['default'];
    return sum + (points * item.quantity);
  }, 0);

  if (totalPoints === 0) return 0;

  // 2. Determine Logistics (Full Bikes vs Partial Remainder)
  const fullBikesNeeded = Math.floor(totalPoints / 100);
  const remainderPoints = totalPoints % 100;
  
  // Calculate Base Cost (Logistics Cost)
  let baseCost = fullBikesNeeded * COST_PER_FULL_BIKE;

  if (remainderPoints > 0) {
    // Find the cheapest tier that fits the remainder
    const tier = PRICING_TIERS.find(t => remainderPoints <= t.maxPoints);
    baseCost += tier ? tier.cost : COST_PER_FULL_BIKE;
  }

  // 3. Calculate Distance Markup
  const distance = LGA_DISTANCES[lga] || BASE_DISTANCE_KM;
  let distanceMarkup = 0;

  if (distance > BASE_DISTANCE_KM) {
    const extraKm = distance - BASE_DISTANCE_KM;
    const markupSegments = Math.ceil(extraKm / 5);
    const costPerTrip = markupSegments * MARKUP_PER_5KM;
    
    // Calculate total trips (Full bikes + 1 for remainder if exists)
    const totalTrips = fullBikesNeeded + (remainderPoints > 0 ? 1 : 0);
    
    distanceMarkup = costPerTrip * totalTrips;
  }

  // 4. Return Final Total
  return baseCost + distanceMarkup;
}
