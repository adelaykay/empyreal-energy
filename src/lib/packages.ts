export type PackageId = 'essential' | 'professional' | 'executive';

export interface SolarPackage {
  id: PackageId;
  name: string;
  badge: string;
  bestFor: string;
  price: number;
  /** Nominal battery capacity in Wh (12V x Ah x quantity) */
  backupWh: number;
  /** Total solar array output in watts */
  solarW: number;
  powers: string[];
  includes: string[];
}

export const PACKAGES: SolarPackage[] = [
  {
    id: 'essential',
    name: 'The Essential',
    badge: 'Most Popular',
    bestFor: 'Small shops • Kiosks • Barbers',
    price: 850000,
    backupWh: 2400, // 1 x 200Ah x 12V
    solarW: 900, // 2 x 450W
    powers: ['4-6 LED bulbs', '2 standing fans', '1 laptop / POS system', 'Phone charging station'],
    includes: [
      'Deep-cycle battery bank',
      'High-efficiency monocrystalline panels',
      'Pure sine wave inverter',
      'Solar charge controller',
      'Complete wiring & setup',
      'Free delivery (Lagos)',
    ],
  },
  {
    id: 'professional',
    name: 'The Professional',
    badge: 'Best Value',
    bestFor: 'Salons • Pharmacies • Business centres',
    price: 1300000,
    backupWh: 4800, // 2 x 200Ah x 12V
    solarW: 1800, // 4 x 450W
    powers: ['8-10 LED bulbs', '4 standing fans', '1 small fridge or freezer', '2 laptops / TV / sound system'],
    includes: [
      'Deep-cycle battery bank (Tubular/Gel)',
      'High-efficiency monocrystalline panels',
      'Pure sine wave inverter',
      'Solar charge controller',
      'Complete wiring & setup',
      'Free delivery (Lagos)',
    ],
  },
  {
    id: 'executive',
    name: 'The Executive',
    badge: 'Premium',
    bestFor: 'Offices • Mini-marts • Advanced setups',
    price: 2200000,
    backupWh: 9600, // 4 x 200Ah x 12V
    solarW: 3600, // 8 x 450W
    powers: [
      '15+ LED bulbs',
      '5 standing fans',
      '1 inverter AC (1HP)',
      '1 large fridge / freezer',
      'Multiple laptops & workstations',
    ],
    includes: [
      'Extended deep-cycle battery bank',
      'High-efficiency monocrystalline panels',
      'Pure sine wave inverter',
      'MPPT smart controller',
      'Heavy-duty wiring & setup',
      'Free delivery (Lagos)',
    ],
  },
];

export const formatNumber = (n: number) => new Intl.NumberFormat('en-NG').format(n);
export const CAPACITY_NOTE =
  'Backup capacity is nominal battery storage. Usable energy depends on battery type and depth of discharge. Actual runtime varies by appliance wattage.';
