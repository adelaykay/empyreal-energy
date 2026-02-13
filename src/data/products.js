import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' with {type: 'json'}; // Ensure this file is in .gitignore
import { Timestamp } from 'firebase-admin/firestore';

const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Helper to create a dummy timestamp for the sample data
const now = Timestamp.now();


const products = [
  // --- SOLAR PANELS ---
  {
    id: "pnl-001",
    name: "300W Polycrystalline Solar Panel",
    slug: "300w-poly-solar-panel",
    category: "panel",
    description: "High-efficiency polycrystalline panel ideal for budget-friendly residential installations. Durable frame and high transmission glass.",
    specifications: {
      "Wattage": "300W",
      "Type": "Polycrystalline",
      "Voltage (Voc)": "45.5V",
      "Efficiency": "17.5%"
    },
    price: 85000,
    compareAtPrice: 95000,
    inStock: true,
    stockQuantity: 50,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Fpnl-001%2Fpanel-300w-poly.png?alt=media&token=d94b94c0-42c8-4553-a350-d5d3595016aa"],
    featured: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "pnl-002",
    name: "450W Monocrystalline PERC Panel",
    slug: "450w-mono-perc-panel",
    category: "panel",
    description: "Tier-1 Monocrystalline module with PERC technology for superior performance in low-light conditions. Perfect for rooftop arrays.",
    specifications: {
      "Wattage": "450W",
      "Type": "Monocrystalline",
      "Voltage (Voc)": "49.8V",
      "Cell Tech": "Half-cut PERC"
    },
    price: 135000,
    inStock: true,
    stockQuantity: 120,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Fpnl-002%2Fpanel-450w-mono.png?alt=media&token=4d458ede-2a4a-4a95-8907-5efc5893c5ec"],
    featured: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "pnl-003",
    name: "600W Bifacial Solar Panel",
    slug: "600w-bifacial-solar-panel",
    category: "panel",
    description: "Heavy-duty 600W panel capable of capturing sunlight from both sides. Maximum output for commercial or large-scale residential projects.",
    specifications: {
      "Wattage": "600W",
      "Type": "Monocrystalline Bifacial",
      "Voltage (Voc)": "50.2V",
      "Dimensions": "2172 x 1303 x 35mm"
    },
    price: 185000,
    compareAtPrice: 200000,
    inStock: true,
    stockQuantity: 30,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Fpnl-003%2Fpanel-600w.png?alt=media&token=5cbbbff0-0d77-4ff5-92a6-6bce2e640d7c"],
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // --- INVERTERS ---
  {
    id: "inv-001",
    name: "1.5kVA 12V Pure Sine Wave Inverter",
    slug: "1-5kva-12v-inverter",
    category: "inverter",
    description: "Reliable pure sine wave output for sensitive electronics. Supports a single 12V battery system. Ideal for small home office setups.",
    specifications: {
      "Capacity": "1.5kVA",
      "System Voltage": "12V",
      "Waveform": "Pure Sine Wave",
      "Display": "LCD"
    },
    price: 210000,
    inStock: true,
    stockQuantity: 15,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Finv-001%2Finv-1-5kva.png?alt=media&token=30111f04-d727-43a9-80cb-8551c16fdcb9"],
    featured: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "inv-002",
    name: "2.5kVA 24V Hybrid Inverter",
    slug: "2-5kva-24v-hybrid-inverter",
    category: "inverter",
    description: "Robust hybrid inverter with built-in charging capability. Supports 24V battery banks (2x 12V).",
    specifications: {
      "Capacity": "2.5kVA",
      "System Voltage": "24V",
      "Max Charge Current": "50A",
      "Type": "Hybrid"
    },
    price: 350000,
    inStock: true,
    stockQuantity: 10,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Finv-002%2Finv-2-5kva.png?alt=media&token=8e30de12-8a52-468d-beb6-840817f51a00"],
    featured: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "inv-003",
    name: "3.5kVA 24V Empyreal Pro Inverter",
    slug: "3-5kva-24v-pro-inverter",
    category: "inverter",
    description: "Our premium 3.5kVA unit designed for heavy loads including freezers and pumping machines. High surge capability.",
    specifications: {
      "Capacity": "3.5kVA",
      "System Voltage": "24V",
      "Surge Power": "7000VA",
      "Warranty": "18 Months"
    },
    price: 480000,
    compareAtPrice: 520000,
    inStock: true,
    stockQuantity: 8,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Finv-003%2Finv-3-5kva-pro.png?alt=media&token=4d954a87-f637-4ce0-88a6-501bc8e323ae"],
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // --- BATTERIES ---
  {
    id: "bat-001",
    name: "200Ah 12V Deep Cycle Gel Battery",
    slug: "200ah-12v-gel-battery",
    category: "battery",
    description: "Maintenance-free Gel battery. Excellent for environments where topping up water is difficult. Long service life.",
    specifications: {
      "Capacity": "200Ah",
      "Voltage": "12V",
      "Type": "Gel VRLA",
      "Cycles": "1200 @ 50% DOD"
    },
    price: 320000,
    inStock: true,
    stockQuantity: 40,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Fbat-001%2Fbat-gel-200.png?alt=media&token=67c16162-e89c-4c1e-8345-6f0fc6d1dad5"],
    featured: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "bat-002",
    name: "220Ah 12V Tubular Battery",
    slug: "220ah-12v-tubular-battery",
    category: "battery",
    description: "Rugged tubular battery designed for frequent power cuts. Requires maintenance (distilled water) but offers superior longevity.",
    specifications: {
      "Capacity": "220Ah",
      "Voltage": "12V",
      "Type": "Tubular Flooded",
      "Cycles": "1500+ @ 80% DOD"
    },
    price: 295000,
    compareAtPrice: 310000,
    inStock: true,
    stockQuantity: 60,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Fbat-002%2Fbat-tubular-220.png?alt=media&token=bf5b7970-efc5-4fca-95e5-309f7d7d841b"],
    featured: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "bat-003",
    name: "5kWh 48V LiFePO4 Lithium Battery",
    slug: "5kwh-48v-lithium-battery",
    category: "battery",
    description: "Premium Lithium Iron Phosphate battery. Rack-mountable with built-in BMS. 10-year design life.",
    specifications: {
      "Capacity": "100Ah",
      "Voltage": "48V",
      "Energy": "5.12kWh",
      "Type": "LiFePO4"
    },
    price: 1850000,
    inStock: false,
    stockQuantity: 0,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Fbat-003%2Fbat-lithium-48v.png?alt=media&token=aac56512-a532-46b8-9414-fb25ca816c43"],
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // --- CONTROLLERS ---
  {
    id: "ctrl-001",
    name: "60A MPPT Charge Controller",
    slug: "60a-mppt-controller",
    category: "controller",
    description: "High-efficiency MPPT controller. Maximizes energy harvest from your panels by tracking the maximum power point.",
    specifications: {
      "Amperage": "60A",
      "Type": "MPPT",
      "Max PV Voltage": "150V",
      "System": "12V/24V/48V Auto"
    },
    price: 95000,
    inStock: true,
    stockQuantity: 25,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Fctrl-001%2Fctrl-60a-mppt.png?alt=media&token=eda0c804-0751-4d64-9025-3ec25f332b6b"],
    featured: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "ctrl-002",
    name: "30A PWM Charge Controller",
    slug: "30a-pwm-controller",
    category: "controller",
    description: "Basic, reliable PWM controller for smaller systems. Includes USB output for phone charging.",
    specifications: {
      "Amperage": "30A",
      "Type": "PWM",
      "USB Output": "5V 2A",
      "Display": "LCD"
    },
    price: 15000,
    inStock: true,
    stockQuantity: 100,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Fctrl-002%2Fctrl-30a-pwm.png?alt=media&token=92709821-27a9-43af-b59c-85db5ed479c5"],
    featured: false,
    createdAt: now,
    updatedAt: now
  },

  // --- ACCESSORIES (Cables & Water) ---
  {
    id: "acc-001",
    name: "4mm² Single Core PV Cable (Per Yard)",
    slug: "4mm-pv-cable",
    category: "accessory",
    description: "UV-resistant, double-insulated photovoltaic cable for connecting panels to controllers.",
    specifications: {
      "Gauge": "4mm²",
      "Type": "Copper",
      "Color": "Black/Red",
      "Rating": "1000V DC"
    },
    price: 1200,
    inStock: true,
    stockQuantity: 5000,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Facc-001%2Fcable-4mm.png?alt=media&token=6543f147-d8a8-4206-824e-dfd0814da681"],
    featured: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "acc-002",
    name: "Distilled Water (5 Litres)",
    slug: "distilled-water-5l",
    category: "accessory",
    description: "Pure distilled water for maintaining tubular and flooded lead-acid batteries. Prevents mineral buildup.",
    specifications: {
      "Volume": "5 Litres",
      "Purity": "100% Distilled",
      "Container": "Plastic Keg"
    },
    price: 2500,
    inStock: true,
    stockQuantity: 100,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Facc-002%2Fwater-5l.png?alt=media&token=395478a4-83dc-4db3-9660-e2c0e5cb42d6"],
    featured: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "acc-003",
    name: "Distilled Water (10 Litres)",
    slug: "distilled-water-10l",
    category: "accessory",
    description: "Bulk 10L pack of distilled water for battery maintenance.",
    specifications: {
      "Volume": "10 Litres",
      "Purity": "100% Distilled",
      "Container": "Plastic Keg"
    },
    price: 4500,
    compareAtPrice: 5000,
    inStock: true,
    stockQuantity: 80,
    images: ["https://firebasestorage.googleapis.com/v0/b/empyrealenergy.firebasestorage.app/o/products%2Facc-003%2Fwater-10l.png?alt=media&token=00f07311-e832-4645-bf9e-2b4c2025f132"],
    featured: false,
    createdAt: now,
    updatedAt: now
  }
];

// 3. The Upload Function
async function uploadData() {
  const collectionRef = db.collection('products');
  const batch = db.batch();

  console.log(`Starting upload of ${products.length} products...`);

  products.forEach((product) => {
    // We use the 'id' field as the document ID so URLs look clean
    // e.g., /products/pnl-001
    const docRef = collectionRef.doc(product.id);
    
    // Add timestamps (Server side)
    const productWithTimestamps = {
      ...product,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    batch.set(docRef, productWithTimestamps);
  });

  try {
    await batch.commit();
    console.log('✅ Success! All products uploaded to Firestore.');
  } catch (error) {
    console.error('❌ Error uploading products:', error);
  }
}

uploadData();
