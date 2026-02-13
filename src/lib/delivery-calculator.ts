import { CartItem } from '@/types/cart';
import { ProductCategory } from '@/types/product';

// --- CONFIGURATION CONSTANTS ---

export const LGA_DISTANCES: Record<string, number> = {
  'Agege': 32, 'Ajeromi-Ifelodun': 20, 'Alimosho': 21, 'Amuwo-Odofin': 17,
  'Apapa': 26, 'Badagry': 38, 'Epe': 100, 'Eti-Osa': 60,
  'Ibeju-Lekki': 90, 'Ifako-Ijaiye': 40, 'Ikeja': 40, 'Ikorodu': 55,
  'Kosofe': 40, 'Lagos Island': 37, 'Lagos Mainland': 32, 'Mushin': 30,
  'Ojo': 5, 'Oshodi-Isolo': 31, 'Shomolu': 36, 'Surulere': 25,
};

// --- UBER PACKAGE CONFIGURATION ---
const UBER_CONFIG = {
  BASE_FARE: 1421,
  MIN_FARE: 1613,
  PER_KM: 151,
  BOOKING_FEE: 232,
  MAX_WEIGHT_KG: 15,
  MAX_VALUE_NGN: 50000,
};

// Load Points: Defines how much space an item takes (Standard Logistics)
const ITEM_POINTS: Record<string, number> = {
  'panel': 12,       // 4 panels = 48 pts
  'battery': 22,     // 2 batteries = 44 pts
  'inverter': 8,     // 1 inverter = 8 pts
  'controller': 1,
  'accessory': 0.5,
  'default': 2
};

// Standard Pricing Tiers
const PRICING_TIERS = [
  { maxPoints: 10,  cost: 10000, label: 'Small Dispatch' }, 
  { maxPoints: 20,  cost: 20000, label: 'Standard Bike' },
  { maxPoints: 45,  cost: 25000, label: 'Heavy Bike' },
  { maxPoints: 100, cost: 75000, label: 'Full Load' }
];

const COST_PER_FULL_BIKE = 75000;
const BASE_DISTANCE_KM = 25; // Surulere
const MARKUP_PER_5KM = 2000;

// --- HELPERS ---

/**
 * Estimates item weight since we don't have a database field for it yet.
 * Used strictly for Uber eligibility checks.
 */
function getEstimatedWeight(item: CartItem): number {
  const category = item.category || 'default';
  const name = (item.name || '').toLowerCase();

  switch (category) {
    case 'panel':
      return 18; // 300W is ~18kg (Too big for Uber anyway due to dims)
    case 'battery':
      if (name.includes('lithium') || name.includes('lifepo4')) return 12; // Small lithium might fit
      return 60; // Standard 200Ah Gel/Tubular is HEAVY
    case 'inverter':
      // 1-2kVA is usually 5-12kg. 3kVA+ is 20kg+
      if (name.includes('3.5kva') || name.includes('5kva') || name.includes('3.5 kva')) return 20;
      return 10; // Default small inverter
    case 'accessory':
      if (name.includes('10l') || name.includes('10 litres')) return 10; // Water
      if (name.includes('5l') || name.includes('5 litres')) return 5;    // Water
      return 1;
    case 'controller':
      return 1.5;
    default:
      return 2;
  }
}

/**
 * Checks if a cart qualifies for Uber Package Send
 */
function isUberEligible(cartItems: CartItem[], totalValue: number): boolean {
  // 1. Check Value Limit
  if (totalValue > UBER_CONFIG.MAX_VALUE_NGN) return false;

  let totalWeight = 0;
  
  for (const item of cartItems) {
    // 2. Check for "Banned" Dimensions
    // Panels are too long (60"+) for a bike box, regardless of weight
    if (item.category === 'panel') return false;
    
    // Large batteries are too heavy/hazardous
    if (item.category === 'battery' && getEstimatedWeight(item) > 15) return false;

    totalWeight += getEstimatedWeight(item) * item.quantity;
  }

  // 3. Check Weight Limit
  return totalWeight <= UBER_CONFIG.MAX_WEIGHT_KG;
}

// --- MAIN FUNCTION ---

export function calculateDeliveryFee(lga: string, cartItems: CartItem[]): number {
  // 0. Pre-calculation
  const totalValue = cartItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  const distance = LGA_DISTANCES[lga] || BASE_DISTANCE_KM;

  // --- STRATEGY 1: UBER PACKAGE SEND ---
  let uberPrice = Infinity;
  
  if (isUberEligible(cartItems, totalValue)) {
    // Formula: Base + (Km * Rate) + Booking
    const rideCost = UBER_CONFIG.BASE_FARE + (distance * UBER_CONFIG.PER_KM) + UBER_CONFIG.BOOKING_FEE;
    uberPrice = Math.max(UBER_CONFIG.MIN_FARE, rideCost);
  }

  // --- STRATEGY 2: STANDARD LOGISTICS (TIERED) ---
  let standardPrice = 0;
  const totalPoints = cartItems.reduce((sum, item) => {
    const categoryKey = item.category || 'default';
    const points = ITEM_POINTS[categoryKey] || ITEM_POINTS['default'];
    return sum + (points * item.quantity);
  }, 0);

  if (totalPoints > 0) {
    const fullBikesNeeded = Math.floor(totalPoints / 100);
    const remainderPoints = totalPoints % 100;
    
    let baseCost = fullBikesNeeded * COST_PER_FULL_BIKE;

    if (remainderPoints > 0) {
      const tier = PRICING_TIERS.find(t => remainderPoints <= t.maxPoints);
      baseCost += tier ? tier.cost : COST_PER_FULL_BIKE;
    }

    let distanceMarkup = 0;
    if (distance > BASE_DISTANCE_KM) {
      const extraKm = distance - BASE_DISTANCE_KM;
      const markupSegments = Math.ceil(extraKm / 5);
      const costPerTrip = markupSegments * MARKUP_PER_5KM;
      const totalTrips = fullBikesNeeded + (remainderPoints > 0 ? 1 : 0);
      distanceMarkup = costPerTrip * totalTrips;
    }
    
    standardPrice = baseCost + distanceMarkup;
  } else {
    // Empty cart shouldn't happen, but safe fallback
    standardPrice = 0;
  }

  // --- FINAL DECISION ---
  // If Uber is possible and cheaper, use it. Otherwise, use standard.
  return (uberPrice < standardPrice) ? Math.ceil(uberPrice/100) * 100 : standardPrice;
}