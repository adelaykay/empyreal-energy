/**
 * Empyreal Energy - Dynamic Delivery Cost Calculator (Load Points System)
 * 
 * Calculates delivery costs based on:
 * - Load points (space/weight allocation per item type)
 * - Distance from Alaba Market (Ojo LGA)
 * - Multiple trip requirements
 */

import { CartItemWithProduct } from "@/types/cart";
import { ProductCategory } from "@/types/product";

// --- CONFIGURATION CONSTANTS ---

// LGA Distance Data (from Alaba Market, Ojo)
export const LGA_DISTANCES: Record<string, number> = {
  'Agege': 32,
  'Ajeromi-Ifelodun': 20,
  'Alimosho': 21,
  'Amuwo-Odofin': 17,
  'Apapa': 26,
  'Badagry': 38,
  'Epe': 100,
  'Eti-Osa': 60,
  'Ibeju-Lekki': 90,
  'Ifako-Ijaiye': 40,
  'Ikeja': 40,
  'Ikorodu': 55,
  'Kosofe': 40,
  'Lagos Island': 37,
  'Lagos Mainland': 32,
  'Mushin': 30,
  'Ojo': 5,
  'Oshodi-Isolo': 31,
  'Shomolu': 36,
  'Surulere': 25,
};

// Load Points: Defines how much space/weight an item takes
// Full bike capacity = 100 points (e.g., 4 panels + 2 batteries + inverter ≈ 100)
const ITEM_POINTS: Record<string, number> = {
  'panel': 12,        // 4 panels = 48 points
  'battery': 22,      // 2 batteries = 44 points
  'inverter': 8,      // 1 inverter = 8 points
  'controller': 1,    // Small controllers
  'accessory': 0.5,   // Cables, small items
  'default': 2        // Unknown items
};

// Base Pricing Tiers (Standard Cost to Surulere/Mainland - 25km)
const PRICING_TIERS = [
  { maxPoints: 10,  cost: 10000 },  // Hand carry (small items)
  { maxPoints: 20,  cost: 20000 },  // Bike light (1 panel)
  { maxPoints: 45,  cost: 25000 },  // Bike medium (2 panels)
  { maxPoints: 100, cost: 75000 }   // Bike full load (4 panels, 2 batteries, inverter)
];

const COST_PER_FULL_BIKE = 75000;   // Cost for a full 100-point bike trip
const BASE_DISTANCE_KM = 25;         // Reference distance (Surulere)
const MARKUP_PER_5KM = 2000;         // Extra cost per 5km per trip

// --- INTERFACES ---

interface CartItem {
  category: ProductCategory;
  quantity: number;
}

// --- MAIN FUNCTION ---

/**
 * Calculate delivery fee based on load points and distance
 * @param lga - Delivery LGA
 * @param cartItems - Array of cart items with category and quantity
 * @returns Total delivery fee in Naira
 */
export function calculateDeliveryFee(lga: string, cartItems: CartItemWithProduct[]): number {
  // 1. Calculate Total Load Points
  const totalPoints = cartItems.reduce((sum, item) => {
    const category = String(item.category || 'default');
    const points = ITEM_POINTS[category] || ITEM_POINTS['default'];
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

/**
 * Get detailed delivery cost breakdown (for display to user)
 */
export function getDeliveryBreakdown(lga: string, cartItems: CartItem[]): {
  totalPoints: number;
  fullBikes: number;
  remainderPoints: number;
  baseCost: number;
  distanceMarkup: number;
  totalCost: number;
  distance: number;
  trips: number;
  vehicleType: string;
  estimatedTime: string;
} {
  const totalPoints = cartItems.reduce((sum, item) => {
    const points = ITEM_POINTS[item.category] || ITEM_POINTS['default'];
    return sum + (points * item.quantity);
  }, 0);

  const fullBikesNeeded = Math.floor(totalPoints / 100);
  const remainderPoints = totalPoints % 100;
  
  let baseCost = fullBikesNeeded * COST_PER_FULL_BIKE;
  if (remainderPoints > 0) {
    const tier = PRICING_TIERS.find(t => remainderPoints <= t.maxPoints);
    baseCost += tier ? tier.cost : COST_PER_FULL_BIKE;
  }

  const distance = LGA_DISTANCES[lga] || BASE_DISTANCE_KM;
  let distanceMarkup = 0;
  
  if (distance > BASE_DISTANCE_KM) {
    const extraKm = distance - BASE_DISTANCE_KM;
    const markupSegments = Math.ceil(extraKm / 5);
    const costPerTrip = markupSegments * MARKUP_PER_5KM;
    const totalTrips = fullBikesNeeded + (remainderPoints > 0 ? 1 : 0);
    distanceMarkup = costPerTrip * totalTrips;
  }

  const trips = fullBikesNeeded + (remainderPoints > 0 ? 1 : 0);
  
  // Determine vehicle type
  let vehicleType = '';
  let estimatedTime = '';
  
  if (totalPoints <= 10) {
    vehicleType = 'Hand Delivery';
    estimatedTime = 'Same day or next day';
  } else if (totalPoints <= 20) {
    vehicleType = 'Motorcycle (Single Item)';
    estimatedTime = '1-2 days';
  } else if (totalPoints <= 45) {
    vehicleType = 'Motorcycle (Medium Load)';
    estimatedTime = '1-2 days';
  } else if (trips === 1) {
    vehicleType = 'Motorcycle (Full Load)';
    estimatedTime = '1-3 days';
  } else {
    vehicleType = `${trips} Motorcycle Trips`;
    estimatedTime = '2-5 days';
  }

  return {
    totalPoints,
    fullBikes: fullBikesNeeded,
    remainderPoints,
    baseCost,
    distanceMarkup,
    totalCost: baseCost + distanceMarkup,
    distance,
    trips,
    vehicleType,
    estimatedTime,
  };
}

/**
 * Get load points for a specific item category
 */
export function getItemPoints(category: string): number {
  return ITEM_POINTS[category] || ITEM_POINTS['default'];
}

/**
 * Example usage:
 * 
 * const cartItems = [
 *   { category: 'panel', quantity: 4 },
 *   { category: 'battery', quantity: 2 },
 *   { category: 'inverter', quantity: 1 }
 * ];
 * 
 * const fee = calculateDeliveryFee('Ikeja', cartItems);
 * const breakdown = getDeliveryBreakdown('Ikeja', cartItems);
 * 
 * console.log(`Delivery Fee: ₦${fee.toLocaleString()}`);
 * console.log(`Trips needed: ${breakdown.trips}`);
 * console.log(`Vehicle: ${breakdown.vehicleType}`);
 */
