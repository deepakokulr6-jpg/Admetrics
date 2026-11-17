/**
 * Demo data shown until the real APIs are connected.
 * Values come from the Figma design. Replace these with API responses –
 * UI text (labels, titles, messages) lives in constants/strings.ts.
 */

export const sampleClinic = {
  clinicName: 'Sai Shree Clinic',
  medicalRegistrationNumber: '195934',
  establishmentYear: '2023',
  licenceNumber: 'KMC/BLR/2026/45892',
  gstNumber: '29ABCDE1234F1Z5',
  panNumber: 'ABCDE1234F',
  address: 'No. 27, 2nd Main Road, Near',
  street: '1st Cross, Indhra Nagar',
  city: 'Mysore',
  state: 'Karnataka',
  pincode: '568902',
  fullAddress:
    'No. 27, 2nd Main Road, Near 1st Cross, Indira Nagar, Mysore, Karnataka – 568902',
};

export const sampleContact = {
  contactPerson: 'Shivan',
  designation: 'Doctor',
  mobile: '9876543210',
  email: 'shivan@gmail.com',
};

export type SampleDisplay = {
  name: string;
  id: string;
  online: boolean;
  uptime: string;
  revenue: string;
};

export const sampleDisplays: SampleDisplay[] = [
  {
    name: 'Reception TV',
    id: 'Display 01',
    online: true,
    uptime: '10 hours 56 minutes',
    revenue: '₹18,250',
  },
  {
    name: 'Waiting Hall TV',
    id: 'Display 02',
    online: false,
    uptime: '10 hours 39 minutes',
    revenue: '₹14,800',
  },
  {
    name: 'Pharmacy TV',
    id: 'Display 03',
    online: false,
    uptime: '07 hours 39 minutes',
    revenue: '₹6,000',
  },
];

/**
 * Clinics shown on the Clinics tab until the API is connected (Figma cards):
 * one waiting for approval, one approved with 3 displays (1 online).
 * Set SHOW_DEMO_CLINICS to false to test the empty "Register" state.
 */
export const SHOW_DEMO_CLINICS = true;

export type DemoClinic = {
  id: string;
  clinicName: string;
  contactName: string;
  designation: string;
  phone: string;
  email: string;
  photos: [number, number];
  approved: boolean;
  displays?: { total: number; online: number };
};

export const sampleClinicList: DemoClinic[] = [
  {
    id: 'demo-pending',
    clinicName: 'Xwell Clinic',
    contactName: 'Shivan',
    designation: 'Doctor',
    phone: '9876543210',
    email: 'shivan@gmail.com',
    photos: [
      require('../../assets/images/figma/sample_entrance.png'),
      require('../../assets/images/figma/sample_reception.png'),
    ],
    approved: false,
  },
  {
    id: 'demo-approved',
    clinicName: 'Xwell Clinic',
    contactName: 'Shivan',
    designation: 'Doctor',
    phone: '9876543210',
    email: 'shivan@gmail.com',
    photos: [
      require('../../assets/images/figma/sample_entrance.png'),
      require('../../assets/images/figma/sample_reception.png'),
    ],
    approved: true,
    // Same displays as Registered Details / Revenue (one source of truth).
    displays: {
      total: sampleDisplays.length,
      online: sampleDisplays.filter(display => display.online).length,
    },
  },
];

export const sampleTopDisplay = {
  name: 'Reception TV',
  /** Share of revenue shown on the "Top performing display" bar (0–1). */
  share: 0.34,
};

export type SupportRequest = {
  title: string;
  ticket: string;
  date: string;
  resolved: boolean;
};

export const sampleSupportRequests: SupportRequest[] = [
  {
    title: 'TV Display Not Working',
    ticket: 'ADM1024',
    date: '02 Nov 2026',
    resolved: false,
  },
  {
    title: 'New Device Installation',
    ticket: 'ADM1021',
    date: '28 Oct 2026',
    resolved: true,
  },
  {
    title: 'TV Display Not Working',
    ticket: 'ADM1024',
    date: '02 Nov 2026',
    resolved: true,
  },
];

export type Statement = { amount: string; month: string; paidOn?: string };

export const sampleStatements: Statement[] = [
  { amount: '₹7,561.60', month: 'October 2026' },
  { amount: '₹32,411.74', month: 'September 2026' },
  { amount: '₹17,123.00', paidOn: '12 September 2026', month: 'August 2026' },
  { amount: '₹10,161.60', paidOn: '12 August 2026', month: 'July 2026' },
  { amount: '₹19,021.17', paidOn: '12 July 2026', month: 'June 2026' },
  { amount: '₹17,571.60', paidOn: '12 June 2026', month: 'May 2026' },
  { amount: '₹32,411.74', paidOn: '12 May 2026', month: 'April 2026' },
  { amount: '₹17,123.00', paidOn: '12 April 2026', month: 'March 2026' },
  { amount: '₹10,161.60', paidOn: '12 March 2026', month: 'February 2026' },
];

export const samplePayout = {
  month: 'October 2026',
  clinics: [
    {
      name: 'Xwell Clinic - Rajajinagar',
      displays: [
        { name: 'Display 1 - Reception TV', amount: '₹7,565.31' },
        { name: 'Display 2- Waiting Hall TV', amount: '₹3,846.43' },
      ],
    },
    {
      name: 'Xwell Clinic - Kamalanagar',
      displays: [
        { name: 'Display 1 - Reception TV', amount: '₹2,675.90' },
        { name: 'Display 2- Waiting Hall TV', amount: '₹6,212.01' },
      ],
    },
  ],
  total: '₹19,411.74',
  paidBy: 'Okulr Techminds',
  paidTo: 'Xwell Clinic',
  paymentDate: '12 Nov 2026',
  transactionId: 'ADM1026001',
  paymentMethod: 'Bank Transfer',
};

export const sampleRevenue = {
  totalRevenue: '₹48,650',
  growth: '12.8%',
  monthlyRevenue: '₹13,580',
  pendingPayout: '₹3,710',
};
