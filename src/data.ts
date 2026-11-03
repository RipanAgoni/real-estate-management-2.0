/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Employee, Asset, Expense, Apartment, Material, Vendor, SystemNotification, Bill, SaasTenant, MaintenanceTicket, Bid, Tender, ProjectMilestone, GanttTask, Lead } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-101',
    name: 'Grand Horizon Towers',
    location: 'Downtown Core, Sector 4',
    status: 'Structure',
    progress: 65,
    budget: 15400000,
    spent: 9800000,
    startDate: '2025-01-15',
    endDate: '2026-12-20',
    manager: 'Sarah Jenkins',
    siteSupervisor: 'Marcus Thorne',
    safetyRating: 'A+',
    description: 'A twin 35-story residential tower development with mixed-use commercial space on the ground levels, including premium amenities and rooftop pool decks.'
  },
  {
    id: 'PRJ-102',
    name: 'Apex Commercial Plaza',
    location: 'Tech Corridor, Zone B',
    status: 'Finishing',
    progress: 88,
    budget: 8500000,
    spent: 7200000,
    startDate: '2025-04-10',
    endDate: '2026-09-15',
    manager: 'David Chen',
    siteSupervisor: 'Robert Vance',
    safetyRating: 'A',
    description: 'Modern environment-friendly LEED certified office campus featuring high-efficiency HVAC systems, flexible open-floor work spaces, and an expansive courtyard.'
  },
  {
    id: 'PRJ-103',
    name: 'Aura Luxury Villas',
    location: 'Lakeside District, Plot 12',
    status: 'Excavation',
    progress: 15,
    budget: 4200000,
    spent: 650000,
    startDate: '2026-02-01',
    endDate: '2027-06-30',
    manager: 'Elena Rostova',
    siteSupervisor: 'Dmitri Vanko',
    safetyRating: 'A+',
    description: 'A gated enclave of 12 bespoke, highly engineered luxury smart villas with passive cooling designs, private infinity pools, and zero-carbon building materials.'
  },
  {
    id: 'PRJ-104',
    name: 'EcoPark Residential',
    location: 'Greenwood Suburbs',
    status: 'Planning',
    progress: 5,
    budget: 11200000,
    spent: 120000,
    startDate: '2026-08-01',
    endDate: '2028-04-15',
    manager: 'Marcus Vance',
    siteSupervisor: 'Clara Oswald',
    safetyRating: 'Pending',
    description: 'Affordable sustainable housing project of 150 units with shared community farming modules, central greywater recycling, and localized microgrid power.'
  },
  {
    id: 'PRJ-105',
    name: 'Metro Overpass Link',
    location: 'Central Ring Road',
    status: 'Completed',
    progress: 100,
    budget: 3100000,
    spent: 2950000,
    startDate: '2024-03-10',
    endDate: '2026-01-30',
    manager: 'Sarah Jenkins',
    siteSupervisor: 'Liam Gallagher',
    safetyRating: 'A+',
    description: 'Civil structural overpass connecting the new transit hub to the downtown district office gates, built utilizing precast composite-concrete beams.'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Sarah Jenkins',
    role: 'Senior Project Director',
    department: 'Engineering',
    email: 's.jenkins@apexrealestate.com',
    phone: '+1 (555) 234-5678',
    status: 'Active',
    salary: 135000,
    joiningDate: '2022-03-15',
    assignedProject: 'Grand Horizon Towers'
  },
  {
    id: 'EMP-002',
    name: 'David Chen',
    role: 'Infrastructure Architect',
    department: 'Engineering',
    email: 'd.chen@apexrealestate.com',
    phone: '+1 (555) 345-6789',
    status: 'Active',
    salary: 118000,
    joiningDate: '2023-01-10',
    assignedProject: 'Apex Commercial Plaza'
  },
  {
    id: 'EMP-003',
    name: 'Marcus Thorne',
    role: 'Chief Construction Supervisor',
    department: 'Operations',
    email: 'm.thorne@apexrealestate.com',
    phone: '+1 (555) 456-7890',
    status: 'Active',
    salary: 89000,
    joiningDate: '2021-08-01',
    assignedProject: 'Grand Horizon Towers'
  },
  {
    id: 'EMP-004',
    name: 'Amanda Ross',
    role: 'HR Director',
    department: 'HR',
    email: 'a.ross@apexrealestate.com',
    phone: '+1 (555) 567-8901',
    status: 'Active',
    salary: 95000,
    joiningDate: '2020-05-12'
  },
  {
    id: 'EMP-005',
    name: 'Gregory Pecks',
    role: 'Chief Financial Analyst',
    department: 'Finance',
    email: 'g.pecks@apexrealestate.com',
    phone: '+1 (555) 678-9012',
    status: 'Active',
    salary: 105000,
    joiningDate: '2019-11-20'
  },
  {
    id: 'EMP-006',
    name: 'Elena Rostova',
    role: 'Civil Project Engineer',
    department: 'Engineering',
    email: 'e.rostova@apexrealestate.com',
    phone: '+1 (555) 789-0123',
    status: 'Active',
    salary: 96000,
    joiningDate: '2024-06-01',
    assignedProject: 'Aura Luxury Villas'
  },
  {
    id: 'EMP-007',
    name: 'Jack Malone',
    role: 'Senior Concrete Specialist',
    department: 'Labor',
    email: 'j.malone@contractors.com',
    phone: '+1 (555) 890-1234',
    status: 'Contractor',
    salary: 75000,
    joiningDate: '2025-02-15',
    assignedProject: 'Grand Horizon Towers'
  },
  {
    id: 'EMP-008',
    name: 'Claire Standish',
    role: 'Property Leasing Lead',
    department: 'Property Sales',
    email: 'c.standish@apexrealestate.com',
    phone: '+1 (555) 901-2345',
    status: 'Active',
    salary: 82000,
    joiningDate: '2023-09-01'
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'AST-801',
    name: 'Caterpillar 320 Hydraulic Excavator',
    type: 'Machinery',
    status: 'Operational',
    value: 145000,
    purchaseDate: '2023-05-18',
    location: 'Lakeside District, Plot 12',
    lastServiceDate: '2026-04-10',
    assignedProject: 'Aura Luxury Villas'
  },
  {
    id: 'AST-802',
    name: 'Liebherr 280 EC-H Tower Crane',
    type: 'Machinery',
    status: 'Operational',
    value: 380000,
    purchaseDate: '2024-01-12',
    location: 'Downtown Core, Sector 4',
    lastServiceDate: '2026-05-02',
    assignedProject: 'Grand Horizon Towers'
  },
  {
    id: 'AST-803',
    name: 'Volvo FMX Tipper Truck',
    type: 'Vehicle',
    status: 'Under Maintenance',
    value: 115000,
    purchaseDate: '2024-07-22',
    location: 'Central Depot & Repairs',
    lastServiceDate: '2026-07-01',
    assignedProject: 'Grand Horizon Towers'
  },
  {
    id: 'AST-804',
    name: 'Trimble S7 Total Station Survey Kit',
    type: 'Construction Tool',
    status: 'Operational',
    value: 22000,
    purchaseDate: '2025-02-05',
    location: 'Greenwood Suburbs',
    lastServiceDate: '2026-01-15',
    assignedProject: 'EcoPark Residential'
  },
  {
    id: 'AST-805',
    name: 'Cummins 500kVA Soundproof Generator',
    type: 'Machinery',
    status: 'Needs Repair',
    value: 45000,
    purchaseDate: '2022-10-09',
    location: 'Tech Corridor, Zone B',
    lastServiceDate: '2026-03-20',
    assignedProject: 'Apex Commercial Plaza'
  },
  {
    id: 'AST-806',
    name: 'Office IT Server Array (HQ)',
    type: 'IT Equipment',
    status: 'Operational',
    value: 35000,
    purchaseDate: '2024-11-12',
    location: 'HQ Central Server Room',
    lastServiceDate: '2025-11-10'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'EXP-401',
    category: 'Material',
    amount: 145000,
    date: '2026-06-15',
    description: '45 Tons structural grade steel reinforcement bars',
    projectName: 'Grand Horizon Towers',
    status: 'Approved'
  },
  {
    id: 'EXP-402',
    category: 'Labor',
    amount: 42000,
    date: '2026-06-20',
    description: 'Excavation subcontractors bi-weekly payroll cycle',
    projectName: 'Aura Luxury Villas',
    status: 'Approved'
  },
  {
    id: 'EXP-403',
    category: 'Equipment',
    amount: 15500,
    date: '2026-06-22',
    description: 'Tower crane monthly operating maintenance and diesel fuel delivery',
    projectName: 'Grand Horizon Towers',
    status: 'Approved'
  },
  {
    id: 'EXP-404',
    category: 'Permits',
    amount: 8500,
    date: '2026-06-25',
    description: 'Local Municipal environmental approval license & tree replanting levy',
    projectName: 'EcoPark Residential',
    status: 'Approved'
  },
  {
    id: 'EXP-405',
    category: 'Material',
    amount: 95000,
    date: '2026-06-28',
    description: 'Premium double-glazed facade window shipment order deposit',
    projectName: 'Apex Commercial Plaza',
    status: 'Pending'
  },
  {
    id: 'EXP-406',
    category: 'Utilities',
    amount: 3400,
    date: '2026-07-01',
    description: 'Temporary water main link & high-voltage grid setup on construction site',
    projectName: 'Aura Luxury Villas',
    status: 'Pending'
  },
  {
    id: 'EXP-407',
    category: 'Marketing',
    amount: 32000,
    date: '2026-06-10',
    description: 'Grand Horizon penthouse virtual 3D rendering walkthrough & social campaign',
    projectName: 'Grand Horizon Towers',
    status: 'Approved'
  },
  {
    id: 'EXP-408',
    category: 'Labor',
    amount: 55000,
    date: '2026-07-02',
    description: 'Finishing floor tiling contractor mobilization fees',
    projectName: 'Apex Commercial Plaza',
    status: 'Pending'
  }
];

export const INITIAL_APARTMENTS: Apartment[] = [
  {
    id: 'APT-1001',
    buildingName: 'Grand Horizon Towers',
    unitNumber: 'A-2401',
    type: 'Penthouse',
    status: 'Sold',
    price: 1850000,
    areaSqFt: 3400,
    tenantName: 'Arthur Pendelton',
    leaseStart: '2025-10-01'
  },
  {
    id: 'APT-1002',
    buildingName: 'Grand Horizon Towers',
    unitNumber: 'A-1204',
    type: '3BHK',
    status: 'Rented',
    price: 820000,
    areaSqFt: 1850,
    tenantName: 'The Miller Family',
    leaseStart: '2026-01-10',
    leaseEnd: '2027-01-10',
    monthlyRent: 4200
  },
  {
    id: 'APT-1003',
    buildingName: 'Grand Horizon Towers',
    unitNumber: 'B-0802',
    type: '2BHK',
    status: 'Available',
    price: 540000,
    areaSqFt: 1350
  },
  {
    id: 'APT-1004',
    buildingName: 'Grand Horizon Towers',
    unitNumber: 'B-1505',
    type: '1BHK',
    status: 'Rented',
    price: 380000,
    areaSqFt: 920,
    tenantName: 'Amelie Laurent',
    leaseStart: '2026-04-01',
    leaseEnd: '2027-04-01',
    monthlyRent: 2300
  },
  {
    id: 'APT-1005',
    buildingName: 'Grand Horizon Towers',
    unitNumber: 'A-0202',
    type: 'Commercial',
    status: 'Rented',
    price: 1200000,
    areaSqFt: 2100,
    tenantName: 'Pret-A-Manger Franchise',
    leaseStart: '2025-08-01',
    leaseEnd: '2030-08-01',
    monthlyRent: 6800
  },
  {
    id: 'APT-1006',
    buildingName: 'Grand Horizon Towers',
    unitNumber: 'B-1401',
    type: '2BHK',
    status: 'Maintenance',
    price: 560000,
    areaSqFt: 1380
  },
  {
    id: 'APT-1007',
    buildingName: 'Apex Commercial Plaza',
    unitNumber: 'Floor 3',
    type: 'Commercial',
    status: 'Rented',
    price: 2500000,
    areaSqFt: 12000,
    tenantName: 'Synthetix AI Systems Corp',
    leaseStart: '2026-03-01',
    leaseEnd: '2031-03-01',
    monthlyRent: 24500
  },
  {
    id: 'APT-1008',
    buildingName: 'Apex Commercial Plaza',
    unitNumber: 'Suite 101',
    type: 'Commercial',
    status: 'Available',
    price: 750000,
    areaSqFt: 3100
  },
  {
    id: 'APT-1009',
    buildingName: 'Metro Link Commercial Arc',
    unitNumber: 'Shop B-2',
    type: 'Studio',
    status: 'Sold',
    price: 280000,
    areaSqFt: 620,
    tenantName: 'Boba Brew & Bakery'
  },
  {
    id: 'APT-1010',
    buildingName: 'Lakeside Heights (Historic)',
    unitNumber: '10C',
    type: '2BHK',
    status: 'Rented',
    price: 490000,
    areaSqFt: 1250,
    tenantName: 'Marko & Julia Diaz',
    leaseStart: '2024-09-15',
    leaseEnd: '2026-09-15',
    monthlyRent: 2100
  }
];

// LocalStorage helpers
export const loadData = <T>(key: string, initial: T): T => {
  try {
    const saved = localStorage.getItem(`re_ms_${key}`);
    return saved ? JSON.parse(saved) : initial;
  } catch (e) {
    console.error('Error reading localStorage', e);
    return initial;
  }
};

export const saveData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(`re_ms_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
};

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'MAT-201',
    name: 'OPC 53 Grade Cement',
    category: 'Raw Materials',
    stock: 450,
    unit: 'Bags',
    minStockLevel: 100,
    unitPrice: 12,
    supplierName: 'Titan CemCo Ltd',
    lastUpdated: '2026-07-06T10:30:00-07:00',
    location: 'Grand Horizon Towers'
  },
  {
    id: 'MAT-202',
    name: 'TMT Steel Rebars (12mm)',
    category: 'Structural',
    stock: 15,
    unit: 'Tons',
    minStockLevel: 5,
    unitPrice: 850,
    supplierName: 'Apex Steel Foundries',
    lastUpdated: '2026-07-05T14:20:00-07:00',
    location: 'Grand Horizon Towers'
  },
  {
    id: 'MAT-203',
    name: 'Ready-Mix Concrete M25',
    category: 'Structural',
    stock: 80,
    unit: 'm³',
    minStockLevel: 20,
    unitPrice: 110,
    supplierName: 'RapidPour Concrete',
    lastUpdated: '2026-07-06T09:15:00-07:00',
    location: 'Aura Luxury Villas'
  },
  {
    id: 'MAT-204',
    name: 'Copper Pipe Fitting 1/2"',
    category: 'Plumbing',
    stock: 350,
    unit: 'Units',
    minStockLevel: 50,
    unitPrice: 4.5,
    supplierName: 'CopperFlow Fittings',
    lastUpdated: '2026-07-04T11:00:00-07:00',
    location: 'Apex Commercial Plaza'
  },
  {
    id: 'MAT-205',
    name: 'Low-Smoke FRLS Wire Bundle',
    category: 'Electrical',
    stock: 8,
    unit: 'Coils',
    minStockLevel: 10,
    unitPrice: 120,
    supplierName: 'ElectraVolt Cabling',
    lastUpdated: '2026-07-07T08:00:00-07:00',
    location: 'Grand Horizon Towers'
  },
  {
    id: 'MAT-206',
    name: 'Vitrified Floor Tiles (60x60)',
    category: 'Finishing',
    stock: 120,
    unit: 'Boxes',
    minStockLevel: 150,
    unitPrice: 35,
    supplierName: 'Titan CemCo Ltd',
    lastUpdated: '2026-07-05T16:45:00-07:00',
    location: 'Apex Commercial Plaza'
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'VND-001',
    name: 'Titan CemCo Ltd',
    type: 'Material Supplier',
    contactPerson: 'John Carter',
    phone: '+1 (555) 987-6543',
    email: 'sales@titancement.com',
    suppliedItems: ['OPC 53 Grade Cement', 'PPC Cement', 'Vitrified Floor Tiles (60x60)'],
    status: 'Active',
    rating: 5,
    activeContractsCount: 2
  },
  {
    id: 'VND-002',
    name: 'Apex Steel Foundries',
    type: 'Material Supplier',
    contactPerson: 'Samantha Steel',
    phone: '+1 (555) 876-5432',
    email: 'contracts@apexsteel.com',
    suppliedItems: ['TMT Steel Rebars (12mm)', 'Structural I-Beams'],
    status: 'Active',
    rating: 4,
    activeContractsCount: 1
  },
  {
    id: 'VND-003',
    name: 'RapidPour Concrete',
    type: 'Material Supplier',
    contactPerson: 'Robert Pourer',
    phone: '+1 (555) 765-4321',
    email: 'logistics@rapidpour.com',
    suppliedItems: ['Ready-Mix Concrete M25', 'Precast Beams'],
    status: 'Active',
    rating: 4,
    activeContractsCount: 1
  },
  {
    id: 'VND-004',
    name: 'CopperFlow Fittings',
    type: 'Material Supplier',
    contactPerson: 'Michael Flow',
    phone: '+1 (555) 654-3210',
    email: 'm.flow@copperflow.com',
    suppliedItems: ['Copper Pipe Fitting 1/2"', 'PEX Tubing'],
    status: 'Active',
    rating: 3,
    activeContractsCount: 1
  },
  {
    id: 'VND-005',
    name: 'ElectraVolt Cabling',
    type: 'Material Supplier',
    contactPerson: 'Emily Wire',
    phone: '+1 (555) 543-2109',
    email: 'emily@electravolt.com',
    suppliedItems: ['Low-Smoke FRLS Wire Bundle', 'Conduit Pipes'],
    status: 'Active',
    rating: 5,
    activeContractsCount: 1
  },
  {
    id: 'VND-006',
    name: 'HeavyLift Cranes & Rigging',
    type: 'Machinery Supplier',
    contactPerson: 'Bill Rig',
    phone: '+1 (555) 432-1098',
    email: 'rentals@heavylift.com',
    suppliedItems: ['Liebherr 280 EC-H Tower Crane', 'Volvo FMX Tipper Truck'],
    status: 'Active',
    rating: 5,
    activeContractsCount: 2
  },
  {
    id: 'VND-007',
    name: 'Alpha Labours & Masonry',
    type: 'Labour Contractor',
    contactPerson: 'Carlos Ruiz',
    phone: '+1 (555) 321-0987',
    email: 'carlos@alphalabours.com',
    suppliedItems: ['Subcontractor Masons', 'Carpenters', 'Finishing Floor Tilers'],
    status: 'Active',
    rating: 4,
    activeContractsCount: 3
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'NOT-001',
    tenantId: 'TEN-001',
    title: 'Low Stock Alert: Wire Bundles',
    message: 'Low-Smoke FRLS Wire Bundle is currently at 8 Coils, which is below the minimum required limit of 10 Coils at Grand Horizon Towers.',
    timestamp: '2026-07-07T05:00:00-07:00',
    read: false,
    type: 'warning'
  },
  {
    id: 'NOT-002',
    tenantId: 'TEN-001',
    title: 'Asset Maintained: Excavator',
    message: 'Caterpillar 320 Hydraulic Excavator has successfully passed routine maintenance and is now marked fully Operational.',
    timestamp: '2026-07-06T15:30:00-07:00',
    read: false,
    type: 'success'
  },
  {
    id: 'NOT-003',
    tenantId: 'TEN-001',
    title: 'New Expense Approved',
    message: 'Financial Officer Gregory Pecks approved EXP-401 for 45 Tons of structural steel for Grand Horizon Towers.',
    timestamp: '2026-07-06T11:20:00-07:00',
    read: true,
    type: 'info'
  },
  {
    id: 'NOT-004',
    tenantId: 'TEN-001',
    title: 'Critical: Tiles Stock Depleted',
    message: 'Vitrified Floor Tiles are currently at 120 Boxes, which is below the safe stock minimum of 150 Boxes.',
    timestamp: '2026-07-06T08:15:00-07:00',
    read: false,
    type: 'warning'
  }
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'BIL-501',
    billNumber: 'INV-2026-001',
    apartmentId: 'APT-101',
    buildingName: 'Grand Horizon Towers',
    unitNumber: 'Apt 1204',
    propertyType: '2BHK Apartment',
    billingType: 'Rental',
    customerName: 'Eleanor Vance',
    customerEmail: 'eleanor.v@gmail.com',
    amount: 1800,
    dueDate: '2026-07-15T00:00:00-07:00',
    issuedDate: '2026-07-01T00:00:00-07:00',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    description: 'Monthly rental fee for July 2026.'
  },
  {
    id: 'BIL-502',
    billNumber: 'INV-2026-002',
    apartmentId: 'APT-103',
    buildingName: 'Aura Luxury Villas',
    unitNumber: 'Villa 04',
    propertyType: 'Penthouse Villa',
    billingType: 'Sold',
    customerName: 'Arthur Dent',
    customerEmail: 'arthur.dent@galaxy.com',
    amount: 285000,
    dueDate: '2026-07-30T00:00:00-07:00',
    issuedDate: '2026-07-05T00:00:00-07:00',
    status: 'Unpaid',
    description: 'Final structural hand-over milestone payment (80% stage completion).'
  },
  {
    id: 'BIL-503',
    billNumber: 'INV-2026-003',
    apartmentId: 'APT-102',
    buildingName: 'Grand Horizon Towers',
    unitNumber: 'Apt 802',
    propertyType: '1BHK Apartment',
    billingType: 'Rental',
    customerName: 'Zaphod Beeblebrox',
    customerEmail: 'president@galaxy.com',
    amount: 1400,
    dueDate: '2026-07-05T00:00:00-07:00',
    issuedDate: '2026-06-25T00:00:00-07:00',
    status: 'Overdue',
    description: 'Late rental charge. Please wire immediately.'
  }
];

export const INITIAL_SAAS_TENANTS: SaasTenant[] = [
  {
    id: 'TEN-001',
    companyName: 'Apex Real Estate Solutions',
    adminName: 'Sophia Vandervelde',
    adminEmail: 's.vandervelde@apexrealestate.com',
    subscriptionPlan: 'Business',
    status: 'Active',
    purchaseAmount: 2499,
    purchaseDate: '2026-01-10',
    expiryDate: '2027-01-10',
    propertiesLimit: 100,
    projectsLimit: 25,
    contactPhone: '+1 (555) 019-2831',
    notes: 'Primary enterprise tenant account. Fully customized modules and maximum resources allocated.',
    billingCycle: 'Yearly'
  },
  {
    id: 'TEN-002',
    companyName: 'Vertex Builders & Co',
    adminName: 'Marcus Sterling',
    adminEmail: 'm.sterling@vertexbuilders.com',
    subscriptionPlan: 'Business',
    status: 'Active',
    purchaseAmount: 1299,
    purchaseDate: '2026-03-15',
    expiryDate: '2027-03-15',
    propertiesLimit: 30,
    projectsLimit: 10,
    contactPhone: '+1 (555) 438-9201',
    notes: 'Subscribed under annual billing. Requires high stability.',
    billingCycle: 'Monthly'
  },
  {
    id: 'TEN-003',
    companyName: 'EcoVillas Ltd',
    adminName: 'Lina Green',
    adminEmail: 'lina@ecovillas.io',
    subscriptionPlan: 'Basic',
    status: 'Trial',
    purchaseAmount: 0,
    purchaseDate: '2026-06-20',
    expiryDate: '2026-07-20',
    propertiesLimit: 10,
    projectsLimit: 3,
    contactPhone: '+1 (555) 723-8843',
    notes: 'Trial for sustainable building tracking.',
    billingCycle: 'Monthly'
  }
];

export const INITIAL_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  {
    id: 'TCK-101',
    title: 'Water Seepage in Master Bathroom',
    description: 'Ceiling plaster in the master bath shows water dampness and mold growth. Seems to originate from the floor above.',
    apartmentId: 'APT-101',
    buildingName: 'Grand Horizon Towers',
    unitNumber: 'Apt 1204',
    tenantName: 'Eleanor Vance',
    tenantEmail: 'eleanor.v@gmail.com',
    category: 'Plumbing',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2026-07-06T09:30:00-07:00',
    slaDeadline: '2026-07-07T09:30:00-07:00', // 24h deadline for Business
    assignedStaff: 'Bob Mercer (Plumbing Supervisor)',
    resolutionNotes: ''
  },
  {
    id: 'TCK-102',
    title: 'HVAC Airflow Weak & Whistling Noise',
    description: 'Central air system makes a loud whistling sound when fan speed is medium or high. Air cooling is extremely slow.',
    apartmentId: 'APT-103',
    buildingName: 'Aura Luxury Villas',
    unitNumber: 'Villa 04',
    tenantName: 'Arthur Dent',
    tenantEmail: 'arthur.dent@galaxy.com',
    category: 'HVAC',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2026-07-07T06:00:00-07:00',
    slaDeadline: '2026-07-09T06:00:00-07:00', // 48h deadline
    assignedStaff: '',
    resolutionNotes: ''
  },
  {
    id: 'TCK-103',
    title: 'Balcony Door Lock Broken',
    description: 'Sliding glass door lock is stuck in unlocked state. Balcony is accessible from outside. Security risk.',
    apartmentId: 'APT-102',
    buildingName: 'Grand Horizon Towers',
    unitNumber: 'Apt 802',
    tenantName: 'Zaphod Beeblebrox',
    tenantEmail: 'president@galaxy.com',
    category: 'Structural',
    priority: 'Emergency',
    status: 'Open',
    createdAt: '2026-07-07T07:00:00-07:00',
    slaDeadline: '2026-07-07T11:00:00-07:00', // 4h emergency deadline for Business
    assignedStaff: '',
    resolutionNotes: ''
  }
];

export const INITIAL_TENDERS: Tender[] = [
  {
    id: 'TND-201',
    title: 'Rooftop Glazing & Structural Façade Glass',
    projectName: 'Grand Horizon Towers',
    description: 'Procurement of weather-sealed double-insulated structural tempered glass. Demands thermal insulation and wind load resistant design.',
    category: 'Structural',
    budget: 650000,
    status: 'Open',
    dueDate: '2026-07-20',
    bids: [
      {
        id: 'BID-001',
        vendorId: 'VND-001',
        vendorName: 'Apex Steel Industries',
        amount: 620000,
        deliveryDays: 45,
        proposal: 'Apex Steel offers ultra-tough structural tempered glass panels utilizing custom high-tension steel mounting tracks. Complies with AS-243 safety rules.',
        submittedAt: '2026-07-06T10:00:00-07:00',
        status: 'Pending'
      },
      {
        id: 'BID-002',
        vendorId: 'VND-005',
        vendorName: 'Continental Cement Co.',
        amount: 580000,
        deliveryDays: 60,
        proposal: 'Partnering with Continental Glass divisions, we submit high performance glazed facades with sound-dampening laminate layers.',
        submittedAt: '2026-07-07T04:30:00-07:00',
        status: 'Pending'
      }
    ]
  },
  {
    id: 'TND-202',
    title: 'Smart Automation Hubs & Central Server Nodes',
    projectName: 'Apex Commercial Plaza',
    description: 'Tender for the provision of central server node architecture, Wi-Fi 7 access nodes, and automated building management systems (BMS).',
    category: 'Electrical',
    budget: 320000,
    status: 'Under Review',
    dueDate: '2026-07-15',
    bids: [
      {
        id: 'BID-003',
        vendorId: 'VND-006',
        vendorName: 'Heavy Lift Crane Hire',
        amount: 340000,
        deliveryDays: 20,
        proposal: 'Unsuitable proposal for smart automated hubs.',
        submittedAt: '2026-07-05T09:00:00-07:00',
        status: 'Rejected'
      }
    ]
  }
];

export const INITIAL_PROJECT_MILESTONES: ProjectMilestone[] = [
  // PRJ-101 (Grand Horizon Towers)
  { id: 'MLS-101', projectId: 'PRJ-101', title: 'Excavation & Geotechnical Anchoring Completed', dueDate: '2025-05-10', status: 'Completed', phase: 'Excavation' },
  { id: 'MLS-102', projectId: 'PRJ-101', title: 'Core Foundations & Pile Cap Pouring', dueDate: '2025-09-15', status: 'Completed', phase: 'Excavation' },
  { id: 'MLS-103', projectId: 'PRJ-101', title: 'Tower A & B Structural Framing Topped Out', dueDate: '2026-08-30', status: 'In Progress', phase: 'Structure' },
  { id: 'MLS-104', projectId: 'PRJ-101', title: 'HVAC Secondary Ducts & Mechanical Fitting', dueDate: '2026-10-15', status: 'Pending', phase: 'Finishing' },
  { id: 'MLS-105', projectId: 'PRJ-101', title: 'Façade Glazing & Exterior Waterproofing', dueDate: '2026-11-30', status: 'Pending', phase: 'Finishing' },

  // PRJ-102 (Apex Commercial Plaza)
  { id: 'MLS-201', projectId: 'PRJ-102', title: 'Excavation and retaining wall completion', dueDate: '2025-07-01', status: 'Completed', phase: 'Excavation' },
  { id: 'MLS-202', projectId: 'PRJ-102', title: 'Main structure pouring & columns', dueDate: '2025-11-20', status: 'Completed', phase: 'Structure' },
  { id: 'MLS-203', projectId: 'PRJ-102', title: 'Interior electrical conduits & cabling', dueDate: '2026-04-10', status: 'Completed', phase: 'Finishing' },
  { id: 'MLS-204', projectId: 'PRJ-102', title: 'Plasterboard painting and floor tiling', dueDate: '2026-07-25', status: 'In Progress', phase: 'Finishing' },
  { id: 'MLS-205', projectId: 'PRJ-102', title: 'BMS programming & occupancy hand-off', dueDate: '2026-08-30', status: 'Pending', phase: 'Finishing' }
];

export const INITIAL_GANTT_TASKS: GanttTask[] = [
  // PRJ-101
  { id: 'TSK-101', projectId: 'PRJ-101', name: 'Site Clearing & Grading', startDate: '2025-01-15', endDate: '2025-03-10', progress: 100, phase: 'Planning' },
  { id: 'TSK-102', projectId: 'PRJ-101', name: 'Deep Excavation Work', startDate: '2025-03-11', endDate: '2025-07-05', progress: 100, phase: 'Excavation' },
  { id: 'TSK-103', projectId: 'PRJ-101', name: 'Pile Foundation Driving', startDate: '2025-07-06', endDate: '2025-10-20', progress: 100, phase: 'Excavation' },
  { id: 'TSK-104', projectId: 'PRJ-101', name: 'Podium Structure Pouring', startDate: '2025-10-21', endDate: '2026-02-15', progress: 100, phase: 'Structure' },
  { id: 'TSK-105', projectId: 'PRJ-101', name: 'Superstructure (Tower Floor Slabs)', startDate: '2026-02-16', endDate: '2026-08-15', progress: 75, phase: 'Structure' },
  { id: 'TSK-106', projectId: 'PRJ-101', name: 'Brickwork & Concrete Masonry Walls', startDate: '2026-06-01', endDate: '2026-10-10', progress: 40, phase: 'Structure' },
  { id: 'TSK-107', projectId: 'PRJ-101', name: 'Mechanical & Plumbing Conduits', startDate: '2026-08-16', endDate: '2026-11-20', progress: 0, phase: 'Finishing' },
  { id: 'TSK-108', projectId: 'PRJ-101', name: 'Acoustic Ceiling & Wall Finishing', startDate: '2026-10-15', endDate: '2026-12-15', progress: 0, phase: 'Finishing' },

  // PRJ-102
  { id: 'TSK-201', projectId: 'PRJ-102', name: 'Underground Parking Excavation', startDate: '2025-03-01', endDate: '2025-06-15', progress: 100, phase: 'Excavation' },
  { id: 'TSK-202', projectId: 'PRJ-102', name: 'Basement Structural Pillars', startDate: '2025-06-16', endDate: '2025-09-30', progress: 100, phase: 'Structure' },
  { id: 'TSK-203', projectId: 'PRJ-102', name: 'Multi-Floor Framing Completion', startDate: '2025-10-01', endDate: '2026-02-28', progress: 100, phase: 'Structure' },
  { id: 'TSK-204', projectId: 'PRJ-102', name: 'Exterior Glass Curtain Wall Fitment', startDate: '2026-03-01', endDate: '2026-05-30', progress: 100, phase: 'Finishing' },
  { id: 'TSK-205', projectId: 'PRJ-102', name: 'Internal HVAC and Electrical Fitments', startDate: '2026-04-15', endDate: '2026-07-10', progress: 85, phase: 'Finishing' },
  { id: 'TSK-206', projectId: 'PRJ-102', name: 'Interior Finishing & Polishing', startDate: '2026-07-11', endDate: '2026-08-25', progress: 10, phase: 'Finishing' }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'LEAD-101',
    name: 'Marcus Sterling',
    address: '842 Highland Ave, West End, Metro City',
    phone: '+1 (555) 234-8901',
    email: 'm.sterling@sterlingcap.com',
    requirement: '3BHK Penthouse with Panoramic Terrace',
    budget: 1450000,
    interestedProperties: ['Grand Horizon Towers - Apt 1204', 'Grand Horizon Towers - Apt 802'],
    status: 'Negotiation',
    followupsCount: 4,
    lastFollowupDate: '2026-07-06',
    nextFollowupDate: '2026-07-10',
    notes: 'High intent VIP investor. Reviewing final payment milestones & parking stall allotment.',
    source: 'Website Inquiry',
    assignedAgent: 'Claire Standish',
    createdAt: '2026-06-15',
    followupLogs: [
      { id: 'FL-01', date: '2026-06-16', type: 'Call', notes: 'Initial consultation regarding Grand Horizon 3BHK penthouse specs.', agentName: 'Claire Standish' },
      { id: 'FL-02', date: '2026-06-22', type: 'Meeting', notes: 'In-office architectural review of floor layouts and customized acoustic insulation.', agentName: 'Claire Standish' },
      { id: 'FL-03', date: '2026-06-29', type: 'Site Visit', notes: 'Accompanied site tour to 12th floor core. Client highly impressed with natural lighting.', agentName: 'Claire Standish' },
      { id: 'FL-04', date: '2026-07-06', type: 'Call', notes: 'Negotiated 3% downpayment schedule adjustment. Waiting on board sign-off.', agentName: 'Claire Standish' }
    ]
  },
  {
    id: 'LEAD-102',
    name: 'Victoria Thorne-Smith',
    address: '120 Royal Palm Blvd, Palm Cove',
    phone: '+1 (555) 789-4321',
    email: 'v.thorne@thornedynamics.org',
    requirement: 'Bespoke Luxury Smart Villa with Infinity Pool',
    budget: 2800000,
    interestedProperties: ['Aura Luxury Villas - Villa 04'],
    status: 'Site Visit Scheduled',
    followupsCount: 2,
    lastFollowupDate: '2026-07-05',
    nextFollowupDate: '2026-07-09',
    notes: 'Confirmed site inspection scheduled for Thursday 2 PM with her family architect.',
    source: 'Referral',
    assignedAgent: 'Sophia Vandervelde',
    createdAt: '2026-06-28',
    followupLogs: [
      { id: 'FL-05', date: '2026-06-29', type: 'WhatsApp', notes: 'Shared digital high-res brochure and structural soil test reports.', agentName: 'Sophia Vandervelde' },
      { id: 'FL-06', date: '2026-07-05', type: 'Call', notes: 'Finalized Thursday 2 PM private security clearance for villa site walkthrough.', agentName: 'Sophia Vandervelde' }
    ]
  },
  {
    id: 'LEAD-103',
    name: 'Horizon Cloud Networks (Sean Wu)',
    address: '500 Innovation Way, Suite 400, Tech Park',
    phone: '+1 (555) 890-1234',
    email: 'realestate@horizoncloud.io',
    requirement: 'Commercial Office Space (8,000 - 12,000 sq ft)',
    budget: 3200000,
    interestedProperties: ['Apex Commercial Plaza - Floor 3', 'Apex Commercial Plaza - Suite 101'],
    status: 'Contacted',
    followupsCount: 1,
    lastFollowupDate: '2026-07-04',
    nextFollowupDate: '2026-07-12',
    notes: 'Requires dual-redundant high speed fiber access and server room load bearing specs.',
    source: 'Property Portal',
    assignedAgent: 'Claire Standish',
    createdAt: '2026-07-02',
    followupLogs: [
      { id: 'FL-07', date: '2026-07-04', type: 'Email', notes: 'Sent commercial lease vs outright acquisition financial models and MEP specs.', agentName: 'Claire Standish' }
    ]
  },
  {
    id: 'LEAD-104',
    name: 'Priya & Rahul Sharma',
    address: '44 Meadowbrook Lane, Suburbia',
    phone: '+1 (555) 456-7890',
    email: 'rahul.sharma@medtechlabs.com',
    requirement: '2BHK Family Apartment near Top Schools',
    budget: 540000,
    interestedProperties: ['Grand Horizon Towers - Apt 802', 'Grand Horizon Towers - B-1401'],
    status: 'New',
    followupsCount: 0,
    nextFollowupDate: '2026-07-08',
    notes: 'Looking for prompt occupancy before school year begins. Pre-approved for bank mortgage.',
    source: 'Website Inquiry',
    assignedAgent: 'Claire Standish',
    createdAt: '2026-07-07',
    followupLogs: []
  },
  {
    id: 'LEAD-105',
    name: 'David Miller',
    address: '18 Pinewood Crescent, Uptown',
    phone: '+1 (555) 321-9876',
    email: 'd.miller@client.com',
    requirement: '2BHK Luxury Apartment',
    budget: 620000,
    interestedProperties: ['Grand Horizon Towers - Apt 1204'],
    status: 'Converted',
    followupsCount: 5,
    lastFollowupDate: '2026-06-30',
    notes: 'Converted to official client! Unit Apt 1204 assigned. Client portal active.',
    source: 'Referral',
    assignedAgent: 'Sophia Vandervelde',
    convertedAt: '2026-07-01',
    convertedClientId: 'CLI-001',
    convertedPropertyId: 'APT-101',
    dealValue: 620000,
    createdAt: '2026-05-10',
    followupLogs: [
      { id: 'FL-08', date: '2026-05-12', type: 'Call', notes: 'Introductory call regarding Grand Horizon launch.', agentName: 'Sophia Vandervelde' },
      { id: 'FL-09', date: '2026-05-20', type: 'Meeting', notes: 'Met at showroom to inspect model apartment finishes.', agentName: 'Sophia Vandervelde' },
      { id: 'FL-10', date: '2026-06-05', type: 'Site Visit', notes: 'Walked the unit floor layout and confirmed balcony views.', agentName: 'Sophia Vandervelde' },
      { id: 'FL-11', date: '2026-06-20', type: 'Call', notes: 'Finalized mortgage terms and legal documentation.', agentName: 'Sophia Vandervelde' },
      { id: 'FL-12', date: '2026-06-30', type: 'Meeting', notes: 'Signed sales deed, converted to client, generated invoice.', agentName: 'Sophia Vandervelde' }
    ]
  }
];





