import {
  Property,
  Project,
  InvestmentOpportunity,
  CompanyService,
  ShowcaseItem,
  MediaItem,
  SiteSettings,
  Enquiry,
  InspectionRequest,
  AdminActivity
} from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'Ascent Properties and Investment Company',
  logoUrl: 'https://i.ibb.co/7td1ZWqZ/Chat-GPT-Image-Aug-30-2026-01-01-43-AM-removebg-preview.png',
  heroHeadline: 'BUILDING VALUE. CREATING OPPORTUNITIES.',
  heroSupportingText:
    'Discover exceptional properties, explore real estate opportunities, and build lasting value with a trusted property and investment partner.',
  heroBackground: 'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
  email: 'info.ascentproperties@gmail.com',
  phone: '+2348033402265',
  whatsapp: '+2348033402265',
  officeAddress: 'Ascent Tower, Victoria Island, Lagos, Nigeria',
  businessHours: 'Monday – Friday: 8:30 AM – 5:30 PM | Saturday: 10:00 AM – 3:00 PM',
  socials: {
    tiktok: 'https://www.tiktok.com/@ascent.properties3?_r=1&_t=ZN-9AaKQ8xDVqw',
    facebook: 'https://www.facebook.com/share/1DNcvAk2cS/',
    x: 'https://x.com/AscentPropertie',
    instagram: 'https://www.instagram.com/ascent.properties?rpxt=MXh1M29kYnZka2pieA.',
    email: 'mailto:info.ascentproperties@gmail.com',
  },
};

export const INITIAL_SERVICES: CompanyService[] = [
  {
    id: 'service-sales',
    title: 'Property Sales and Marketing',
    shortDescription:
      'Strategic marketing and sale of premium residential, commercial, and mixed-use developments with unmatched reach.',
    fullDescription:
      'We combine localized real estate intelligence with cutting-edge digital exposure to market luxury homes, serviced apartments, and prime land to discerning buyers in Nigeria and the diaspora.',
    image: 'https://i.ibb.co/60dmwRv4/Gemini-Generated-Image-5ditr65ditr65dit.jpg',
    features: [
      'Comprehensive property valuation & pricing models',
      'Targeted diaspora & institutional buyer outreach',
      'Professional architectural photography and virtual tours',
      'End-to-end legal title verification and closing support'
    ],
    scope: 'Residential & Commercial Asset Sales'
  },
  {
    id: 'service-dev',
    title: 'Property Development',
    shortDescription:
      'End-to-end development of bespoke residential communities, high-yield apartments, and commercial complexes.',
    fullDescription:
      'From architectural conceptualization, feasibility modeling, and structural engineering to project handover, we build timeless properties engineered for capital appreciation and long-term utility.',
    image: 'https://i.ibb.co/tTmZGbkB/Chat-GPT-Image-Aug-30-2026-07-22-04-AM.png',
    features: [
      'Site analysis, environmental vetting & zoning clearance',
      'Architectural master planning & sustainable engineering',
      'Rigorous quality control and timeline adherence',
      'Full turnkey handover with structural warranties'
    ],
    scope: 'Greenfield & Brownfield Property Developments'
  },
  {
    id: 'service-mgmt',
    title: 'Property Management',
    shortDescription:
      'Institutional-grade asset management ensuring optimal tenancy, pristine maintenance, and predictable yields.',
    fullDescription:
      'Protecting asset value through tenant vetting, automated rent collection, preventive facility management, and transparent financial reporting for private and institutional landlords.',
    image: 'https://i.ibb.co/0jVSfY47/Gemini-Generated-Image-qsdwq9qsdwq9qsdw.jpg',
    features: [
      'Thorough tenant screening and background checks',
      '24/7 preventive facility and maintenance management',
      'Timely rent collection and quarterly escrow reporting',
      'Statutory compliance and tenancy agreement administration'
    ],
    scope: 'Residential Estates & Commercial Complexes'
  },
  {
    id: 'service-invest',
    title: 'Investment Advisory',
    shortDescription:
      'Data-driven advisory guiding individuals and syndicates toward high-yield real estate opportunities and wealth growth.',
    fullDescription:
      'Navigating macroeconomic trends, urban migration patterns, and land appreciation corridors to recommend defensive and growth-oriented property assets.',
    image: 'https://i.ibb.co/JwC6Dvf1/Gemini-Generated-Image-l8v7udl8v7udl8v7.jpg',
    features: [
      'Cash flow yield and internal rate of return (IRR) modeling',
      'Pre-construction off-plan entry structuring',
      'Joint-venture equity and syndication advisory',
      'Exit strategy formulation and portfolio rebalancing'
    ],
    scope: 'Private Wealth & Corporate Portfolios'
  },
  {
    id: 'service-land',
    title: 'Land Acquisition and Documentation Support',
    shortDescription:
      'Securing verified land assets in high-growth corridors with unassailable titles and regulatory documentation.',
    fullDescription:
      'Protecting your investments against title defects. We oversee cadastral surveys, Governor’s Consent, Certificate of Occupancy (C of O), Gazette ratification, and registration at state land registries.',
    image: 'https://i.ibb.co/Z6Jmqj99/Gemini-Generated-Image-8eo3z68eo3z68eo3.jpg',
    features: [
      'Comprehensive land registry search and historical title audit',
      'Charted perimeter surveys and beacon identification',
      'C of O and Governor’s Consent processing facilitation',
      'Dispute resolution and boundary securing'
    ],
    scope: 'Acreage, Greenfield Layouts & Commercial Plots'
  },
  {
    id: 'service-consult',
    title: 'Real Estate Consultancy',
    shortDescription:
      'Bespoke strategic consulting for property developers, financial institutions, and sovereign entities.',
    fullDescription:
      'In-depth market research, highest-and-best-use (HBU) studies, regulatory compliance guidance, and feasibility assessments for developers planning high-stakes projects.',
    image: 'https://i.ibb.co/GvK7p9h3/Gemini-Generated-Image-7gze9u7gze9u7gze.jpg',
    features: [
      'Market feasibility & highest-and-best-use (HBU) analysis',
      'Regulatory compliance & urban planning liaison',
      'Financial risk assessment and sensitivity testing',
      'Project turnaround advisory for distressed developments'
    ],
    scope: 'Corporate & Institutional Real Estate Advisory'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-azure-marina',
    title: 'Azure Marina 4-Bedroom Waterfront Villa',
    slug: 'azure-marina-4-bedroom-waterfront-villa',
    price: 450000000,
    formattedPrice: '₦450,000,000',
    location: 'Banana Island, Ikoyi',
    city: 'Lagos',
    state: 'Lagos State',
    type: 'Duplexes',
    purpose: 'Buy',
    size: '820 sqm',
    bedrooms: 4,
    bathrooms: 5,
    featured: true,
    availability: 'Available',
    coverImage: 'https://i.ibb.co/jkcFz9cK/Chat-GPT-Image-Aug-28-2026-12-01-31-AM.png',
    images: [
      'https://i.ibb.co/jkcFz9cK/Chat-GPT-Image-Aug-28-2026-12-01-31-AM.png',
      'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
      'https://i.ibb.co/svPw2mdd/Chat-GPT-Image-Aug-29-2026-04-37-57-PM.png',
      'https://i.ibb.co/60dmwRv4/Gemini-Generated-Image-5ditr65ditr65dit.jpg'
    ],
    description:
      'An architectural tour de force located in the private enclave of Banana Island. This 4-bedroom waterfront sanctuary combines ultra-luxury modern finishes, double-height living areas, private jetty access, an infinity pool overlooking the lagoon, and complete smart home automation.',
    features: [
      'Direct lagoon waterfront with private boat slip',
      'Private infinity edge swimming pool',
      'Custom Italian kitchen with Miele appliances',
      'Fully automated Crestron smart home system',
      'En-suite service quarters and 3-car garage',
      'Industrial water treatment & 24/7 dedicated power'
    ],
    titleDeed: 'Federal C of O & Governor’s Consent',
    yearBuilt: 2025,
    createdAt: '2026-02-15'
  },
  {
    id: 'prop-emerald-bay',
    title: 'The Emerald Bay Haven',
    slug: 'the-emerald-bay-haven',
    price: 280000000,
    formattedPrice: '₦280,000,000',
    location: 'Lekki Phase 1, Admiralty Way',
    city: 'Lagos',
    state: 'Lagos State',
    type: 'Residential',
    purpose: 'Buy',
    size: '650 sqm',
    bedrooms: 5,
    bathrooms: 6,
    featured: true,
    availability: 'Available',
    coverImage: 'https://i.ibb.co/svPw2mdd/Chat-GPT-Image-Aug-29-2026-04-37-57-PM.png',
    images: [
      'https://i.ibb.co/svPw2mdd/Chat-GPT-Image-Aug-29-2026-04-37-57-PM.png',
      'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
      'https://i.ibb.co/tTmZGbkB/Chat-GPT-Image-Aug-30-2026-07-22-04-AM.png'
    ],
    description:
      'The Emerald Bay Haven delivers peerless contemporary elegance in the heart of Lekki Phase 1. Designed for sophisticated family living, this 5-bedroom detached villa boasts soaring ceilings, an expansive rooftop entertainment lounge, swimming pool, and bespoke luxury millwork.',
    features: [
      '5 spacious en-suite bedrooms with walk-in dressing suites',
      'Rooftop terrace lounge with panoramic city views',
      'Private swimming pool and poolside gazebo',
      'Dedicated cinema room and private home office',
      '2-room staff quarters & automated entry gates',
      'CCTV perimeter surveillance and smart security'
    ],
    titleDeed: 'Governor’s Consent',
    yearBuilt: 2025,
    createdAt: '2026-03-01'
  },
  {
    id: 'prop-crestview-pinnacle',
    title: 'Crestview Pinnacle Luxury Apartments',
    slug: 'crestview-pinnacle-luxury-apartments',
    price: 135000000,
    formattedPrice: '₦135,000,000',
    location: 'Victoria Island, Oniru Boundary',
    city: 'Lagos',
    state: 'Lagos State',
    type: 'Apartments',
    purpose: 'Buy',
    size: '240 sqm',
    bedrooms: 3,
    bathrooms: 4,
    featured: true,
    availability: 'Available',
    coverImage: 'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
    images: [
      'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
      'https://i.ibb.co/jkcFz9cK/Chat-GPT-Image-Aug-28-2026-12-01-31-AM.png',
      'https://i.ibb.co/0jVSfY47/Gemini-Generated-Image-qsdwq9qsdwq9qsdw.jpg'
    ],
    description:
      'Impeccably appointed 3-bedroom serviced apartment on high floor with sweeping views across Victoria Island and the Atlantic Ocean. Ideal for high-yielding shortlet hospitality or prime executive residency.',
    features: [
      'Floor-to-ceiling soundproof acoustic double glazing',
      'Elevated Olympic-length swimming pool & gymnasium',
      'High-speed passenger & service elevators',
      'Uninterrupted 24-hour power and treated water supply',
      'Access control cards & concierge reception desk'
    ],
    titleDeed: 'Deed of Sublease / Governor’s Consent',
    yearBuilt: 2024,
    createdAt: '2026-03-10'
  },
  {
    id: 'prop-ascent-park-plots',
    title: 'Ascent Park Prime Commercial & Residential Plots',
    slug: 'ascent-park-prime-plots',
    price: 45000000,
    formattedPrice: '₦45,000,000',
    location: 'Epe Expressway, Adjacent Alaro City',
    city: 'Epe',
    state: 'Lagos State',
    type: 'Land',
    purpose: 'Investment',
    size: '600 sqm',
    featured: true,
    availability: 'Available',
    coverImage: 'https://i.ibb.co/Z6Jmqj99/Gemini-Generated-Image-8eo3z68eo3z68eo3.jpg',
    images: [
      'https://i.ibb.co/Z6Jmqj99/Gemini-Generated-Image-8eo3z68eo3z68eo3.jpg',
      'https://i.ibb.co/JwC6Dvf1/Gemini-Generated-Image-l8v7udl8v7udl8v7.jpg'
    ],
    description:
      'Direct dry table land situated within the fastest-appreciating real estate corridor in West Africa. Ideal for strategic land-banking, gated estate development, or commercial logistics hubs.',
    features: [
      '100% dry table topography requiring zero sand-filling',
      'Perimeter fencing with gated electronic security house',
      'Paved access roads with covered drainage channels',
      'Direct allocation with instant deed issuance'
    ],
    titleDeed: 'Certificate of Occupancy (C of O)',
    createdAt: '2026-01-20'
  },
  {
    id: 'prop-maitama-ambassadorial',
    title: 'The Diplomat 6-Bedroom Ambassadorial Mansion',
    slug: 'the-diplomat-6-bedroom-ambassadorial-mansion',
    price: 950000000,
    formattedPrice: '₦950,000,000',
    location: 'Maitama District',
    city: 'Abuja',
    state: 'Federal Capital Territory',
    type: 'Residential',
    purpose: 'Buy',
    size: '1,450 sqm',
    bedrooms: 6,
    bathrooms: 8,
    featured: false,
    availability: 'Available',
    coverImage: 'https://i.ibb.co/60dmwRv4/Gemini-Generated-Image-5ditr65ditr65dit.jpg',
    images: [
      'https://i.ibb.co/60dmwRv4/Gemini-Generated-Image-5ditr65ditr65dit.jpg',
      'https://i.ibb.co/svPw2mdd/Chat-GPT-Image-Aug-29-2026-04-37-57-PM.png'
    ],
    description:
      'Palatial residence built to diplomatic embassy standards in prime Maitama, Abuja. Features bullet-resistant glazing, multiple grand reception halls, private elevator, industrial kitchen, and lush landscaped gardens.',
    features: [
      'Bulletproof reinforced entry portals & ballistic windows',
      'Private internal hydraulic elevator across 3 floors',
      'Separate ambassadorial banquet hall & diplomatic salon',
      'Olympic-sized swimming pool, sauna and tennis court',
      'Underground parking bay for 8 executive vehicles'
    ],
    titleDeed: 'FCDA Certificate of Occupancy',
    yearBuilt: 2025,
    createdAt: '2026-02-28'
  },
  {
    id: 'prop-victoria-plaza-commercial',
    title: 'Ascent Corporate Tower Grade-A Office Floor',
    slug: 'ascent-corporate-tower-grade-a-office',
    price: 320000000,
    formattedPrice: '₦320,000,000',
    location: 'Adeola Odeku, Victoria Island',
    city: 'Lagos',
    state: 'Lagos State',
    type: 'Commercial',
    purpose: 'Investment',
    size: '500 sqm',
    featured: false,
    availability: 'Available',
    coverImage: 'https://i.ibb.co/GvK7p9h3/Gemini-Generated-Image-7gze9u7gze9u7gze.jpg',
    images: [
      'https://i.ibb.co/GvK7p9h3/Gemini-Generated-Image-7gze9u7gze9u7gze.jpg',
      'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg'
    ],
    description:
      'Turnkey commercial floor plate in an international Grade-A certified office building. Features open-plan flexible workspaces, executive boardrooms, high-speed fiber internet, and comprehensive facilities management.',
    features: [
      'LEED Gold compliant energy-efficient facade',
      'Raised flooring system for flexible IT network routing',
      'Multi-tier security with biometric turnstiles',
      'Dedicated basement parking allocation'
    ],
    titleDeed: 'Governor’s Consent',
    yearBuilt: 2024,
    createdAt: '2026-01-15'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-horizon-residences',
    name: 'The Horizon Waterfront Residences',
    slug: 'the-horizon-waterfront-residences',
    coverImage: 'https://i.ibb.co/jkcFz9cK/Chat-GPT-Image-Aug-28-2026-12-01-31-AM.png',
    images: [
      'https://i.ibb.co/jkcFz9cK/Chat-GPT-Image-Aug-28-2026-12-01-31-AM.png',
      'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
      'https://i.ibb.co/svPw2mdd/Chat-GPT-Image-Aug-29-2026-04-37-57-PM.png'
    ],
    location: 'Gracefield Island, Lekki, Lagos',
    description:
      'A master-planned private enclave featuring 24 luxury waterfront villas and duplexes with private moorings, central clubhouse, and green energy microgrid.',
    type: 'Waterfront Villas',
    status: 'Ongoing',
    progress: 72,
    features: [
      'Private marina with direct water taxi access to Victoria Island',
      'Independent 2MW solar microgrid with battery storage',
      'Gated community with armed security patrols & perimeter sensors',
      'Private sports club, padel courts, and heated swimming pools'
    ],
    availableUnits: '6 of 24 units remaining',
    deliveryDate: 'Q4 2026',
    createdAt: '2025-11-01'
  },
  {
    id: 'proj-ascent-heights',
    name: 'Ascent Heights Luxury Suites',
    slug: 'ascent-heights-luxury-suites',
    coverImage: 'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
    images: [
      'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
      'https://i.ibb.co/60dmwRv4/Gemini-Generated-Image-5ditr65ditr65dit.jpg'
    ],
    location: 'Guzape Hills, Abuja FCT',
    description:
      'A dramatic 14-story residential tower commanding panoramic views over the Federal Capital. Designed with cantilevered infinity pools, smart climate control, and presidential penthouse suites.',
    type: 'Luxury High-Rise',
    status: 'Ongoing',
    progress: 45,
    features: [
      'Sublime views over Abuja city basin from every terrace',
      'Infinity pool suspended 120 feet in the air',
      'Helipad on rooftop with executive lounge access',
      'Valet parking and automated subterranean stacking'
    ],
    availableUnits: '14 of 32 apartments available',
    deliveryDate: 'Q2 2027',
    createdAt: '2026-01-10'
  },
  {
    id: 'proj-lagoon-crest-estate',
    name: 'Lagoon Crest Eco-Estate',
    slug: 'lagoon-crest-eco-estate',
    coverImage: 'https://i.ibb.co/svPw2mdd/Chat-GPT-Image-Aug-29-2026-04-37-57-PM.png',
    images: [
      'https://i.ibb.co/svPw2mdd/Chat-GPT-Image-Aug-29-2026-04-37-57-PM.png',
      'https://i.ibb.co/tTmZGbkB/Chat-GPT-Image-Aug-30-2026-07-22-04-AM.png'
    ],
    location: 'Monastery Road, Sangotedo, Lagos',
    description:
      'Completed boutique development of 18 signature 4-bedroom terrace homes with high rental yield records and complete family recreational facilities.',
    type: 'Residential Estate',
    status: 'Completed',
    progress: 100,
    features: [
      '100% completed and fully occupied with active facility management',
      'Biometric visitor management app and license plate recognition',
      'Dedicated children’s playground and jogging tracks',
      'Independent water filtration plant with 50,000L storage'
    ],
    availableUnits: 'Fully Sold (Secondary resales available)',
    deliveryDate: 'Delivered Q4 2025',
    createdAt: '2025-05-20'
  },
  {
    id: 'proj-monarch-prime-park',
    name: 'Monarch Prime Logistics & Tech Park',
    slug: 'monarch-prime-logistics-tech-park',
    coverImage: 'https://i.ibb.co/GvK7p9h3/Gemini-Generated-Image-7gze9u7gze9u7gze.jpg',
    images: [
      'https://i.ibb.co/GvK7p9h3/Gemini-Generated-Image-7gze9u7gze9u7gze.jpg',
      'https://i.ibb.co/Z6Jmqj99/Gemini-Generated-Image-8eo3z68eo3z68eo3.jpg'
    ],
    location: 'Free Trade Zone Axis, Ibeju-Lekki, Lagos',
    description:
      'Modern logistics and commercial office hub strategically situated along the Lekki Deep Sea Port and Dangote Refinery economic development corridor.',
    type: 'Mixed-Use Commercial',
    status: 'Planning',
    progress: 15,
    features: [
      '50 hectares master planned for light industrial and tech offices',
      'Direct arterial connection to the new international airport route',
      'Heavy-duty industrial concrete pavement & trailer bays',
      'Tax-advantaged enterprise zone status'
    ],
    availableUnits: 'Pre-allocation registrations open',
    deliveryDate: 'Q1 2028',
    createdAt: '2026-02-01'
  }
];

export const INITIAL_INVESTMENTS: InvestmentOpportunity[] = [
  {
    id: 'inv-gracefield-offplan',
    title: 'Gracefield Waterfront Off-Plan Syndication',
    description:
      'Participate in the high-yield construction phase of luxury waterfront villas in Lekki. Capital is secured against freehold title deeds with milestone-based disbursement and verified construction governance.',
    location: 'Gracefield Island, Lekki, Lagos',
    minInvestment: '₦25,000,000',
    investmentPeriod: '18 Months',
    projectedReturn: '26% – 32% Estimated ROI',
    payoutFrequency: 'At project exit / Milestone tranches',
    projectInfo:
      'Phase 2 construction of luxury 4-bedroom waterfront villas. Architectural plans approved by Lagos State Ministry of Physical Planning. Title: Governor’s Consent.',
    supportingImages: [
      'https://i.ibb.co/jkcFz9cK/Chat-GPT-Image-Aug-28-2026-12-01-31-AM.png',
      'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg'
    ],
    documents: [
      { name: 'Investment Memorandum & Feasibility Study (PDF)', url: '#', size: '3.4 MB' },
      { name: 'Architectural Renderings & Milestone Schedule (PDF)', url: '#', size: '5.1 MB' }
    ],
    status: 'Active',
    createdAt: '2026-01-15'
  },
  {
    id: 'inv-epe-corridor-landbanking',
    title: 'Epe Growth Corridor Strategic Land Banking Scheme',
    description:
      'Co-invest in verified titled acreage positioned along the planned Lekki-Epe International Airport and 4th Mainland Bridge interchange. Historically appreciating at 35%+ annually.',
    location: 'Alaro City Environs, Epe, Lagos',
    minInvestment: '₦10,000,000',
    investmentPeriod: '24 – 36 Months',
    projectedReturn: 'Estimated Capital Growth 30%+ p.a.',
    payoutFrequency: 'Capital Gain on Liquidation',
    projectInfo:
      'Freehold land with registered survey and excision gazette. Perimeter beaconing and registered layout plan already completed by our legal partners.',
    supportingImages: [
      'https://i.ibb.co/Z6Jmqj99/Gemini-Generated-Image-8eo3z68eo3z68eo3.jpg',
      'https://i.ibb.co/JwC6Dvf1/Gemini-Generated-Image-l8v7udl8v7udl8v7.jpg'
    ],
    documents: [
      { name: 'Survey Plan & Cadastral Verification (PDF)', url: '#', size: '2.8 MB' },
      { name: 'Land Banking Prospectus 2026 (PDF)', url: '#', size: '4.2 MB' }
    ],
    status: 'Active',
    createdAt: '2026-02-10'
  },
  {
    id: 'inv-victoria-commercial-yield',
    title: 'Ascent Commercial Yield Note (Prime Office Floor)',
    description:
      'Debt-equity structure backed by prime Grade-A commercial real estate in Victoria Island with corporate dollar and naira rental yields.',
    location: 'Victoria Island, Lagos',
    minInvestment: '₦50,000,000',
    investmentPeriod: '12 Months (Renewable)',
    projectedReturn: '18.5% Net Yield p.a.',
    payoutFrequency: 'Quarterly distributions',
    projectInfo:
      'Backed by fully tenanted multinational office floors. High occupancy historical performance with institutional facility management.',
    supportingImages: [
      'https://i.ibb.co/GvK7p9h3/Gemini-Generated-Image-7gze9u7gze9u7gze.jpg',
      'https://i.ibb.co/0jVSfY47/Gemini-Generated-Image-qsdwq9qsdwq9qsdw.jpg'
    ],
    documents: [
      { name: 'Tenancy Summary & Yield Analysis (PDF)', url: '#', size: '2.1 MB' }
    ],
    status: 'Closing Soon',
    createdAt: '2026-03-05'
  }
];

export const INITIAL_SHOWCASE: ShowcaseItem[] = [
  {
    id: 'showcase-1',
    title: 'Azure Marina Villa Lagoon Front Facade',
    category: 'Exteriors',
    mediaType: 'image',
    url: 'https://i.ibb.co/jkcFz9cK/Chat-GPT-Image-Aug-28-2026-12-01-31-AM.png',
    description: 'Bespoke waterfront architecture featuring travertine cladding and structural glass.',
    location: 'Banana Island, Ikoyi'
  },
  {
    id: 'showcase-2',
    title: 'The Emerald Bay Haven Courtyard & Terrace',
    category: 'Properties',
    mediaType: 'image',
    url: 'https://i.ibb.co/svPw2mdd/Chat-GPT-Image-Aug-29-2026-04-37-57-PM.png',
    description: 'Lekki Phase 1 luxury detached villa illuminated at twilight.',
    location: 'Lekki Phase 1, Lagos'
  },
  {
    id: 'showcase-3',
    title: 'High-Rise Architectural Cantilever Detail',
    category: 'Projects',
    mediaType: 'image',
    url: 'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
    description: 'Precision engineering and sleek aerodynamic balcony profiles.',
    location: 'Victoria Island'
  },
  {
    id: 'showcase-4',
    title: 'Double-Height Living Salon & Italian Millwork',
    category: 'Interiors',
    mediaType: 'image',
    url: 'https://i.ibb.co/60dmwRv4/Gemini-Generated-Image-5ditr65ditr65dit.jpg',
    description: 'Custom lighting, marble slabs, and European furnishings.',
    location: 'Ikoyi, Lagos'
  },
  {
    id: 'showcase-5',
    title: 'Urban Master Planning & Site Construction Works',
    category: 'Construction',
    mediaType: 'image',
    url: 'https://i.ibb.co/212PyYPQ/Gemini-Generated-Image-fq3ktgfq3ktgfq3k.jpg',
    description: 'Structural piling and reinforcement adhering to British standard concrete mix.',
    location: 'Gracefield Island'
  },
  {
    id: 'showcase-6',
    title: 'Corporate Executive Suite & Boardroom',
    category: 'Interiors',
    mediaType: 'image',
    url: 'https://i.ibb.co/vx2Kdvck/Gemini-Generated-Image-kjzs7xkjzs7xkjzs.jpg',
    description: 'Grade-A smart boardroom equipped with video conferencing and acoustics.',
    location: 'Victoria Island'
  },
  {
    id: 'showcase-7',
    title: 'Prime Gated Estate Aerial Layout',
    category: 'Exteriors',
    mediaType: 'image',
    url: 'https://i.ibb.co/0jMMHYsD/Gemini-Generated-Image-9a20df9a20df9a20.jpg',
    description: 'Carefully zoned residential plots with planned green reserves and paved arterial roads.',
    location: 'Epe Corridor'
  },
  {
    id: 'showcase-8',
    title: 'Ascent Master Planned Eco-City Infrastructure',
    category: 'Exteriors',
    mediaType: 'image',
    url: 'https://i.ibb.co/Gfnr7yrs/Gemini-Generated-Image-nqjomdnqjomdnqjo.jpg',
    description: 'Sustainable master community planning with arterial boulevards and environmental buffer zones.',
    location: 'Lagos & Abuja'
  },
  {
    id: 'showcase-9',
    title: 'Ascent Properties Architectural Showcase Reel',
    category: 'Videos',
    mediaType: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
    description: 'Cinematic walk-through of recent luxury residential developments and skyline projects.',
    location: 'Lagos & Abuja'
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'media-logo',
    title: 'Official Company Logo',
    description: 'Official transparent brand identity logo for Ascent Properties and Investment Company',
    category: 'Hero',
    mediaType: 'image',
    url: 'https://i.ibb.co/7td1ZWqZ/Chat-GPT-Image-Aug-30-2026-01-01-43-AM-removebg-preview.png',
    isPublished: true,
    uploadedAt: '2026-08-30',
    usedIn: ['Navbar', 'Footer', 'Admin Login', 'Contact Page']
  },
  {
    id: 'media-hero',
    title: 'Official Homepage Hero Background',
    description: 'Primary architectural hero visual depicting luxury contemporary real estate',
    category: 'Hero',
    mediaType: 'image',
    url: 'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
    isPublished: true,
    uploadedAt: '2026-10-15',
    usedIn: ['Homepage Hero', 'Showcase']
  },
  {
    id: 'media-azure',
    title: 'Azure Marina Villa Front',
    description: 'Official photo for Azure Marina 4-Bedroom Waterfront Villa',
    category: 'Properties',
    mediaType: 'image',
    url: 'https://i.ibb.co/jkcFz9cK/Chat-GPT-Image-Aug-28-2026-12-01-31-AM.png',
    isPublished: true,
    uploadedAt: '2026-08-28',
    usedIn: ['Azure Marina Villa', 'Showcase']
  },
  {
    id: 'media-emerald',
    title: 'The Emerald Bay Haven Facade',
    description: 'Official photo for The Emerald Bay Haven Lekki',
    category: 'Properties',
    mediaType: 'image',
    url: 'https://i.ibb.co/svPw2mdd/Chat-GPT-Image-Aug-29-2026-04-37-57-PM.png',
    isPublished: true,
    uploadedAt: '2026-08-29',
    usedIn: ['The Emerald Bay Haven', 'Showcase']
  },
  {
    id: 'media-srv-1',
    title: 'Property Sales & Marketing Hero',
    description: 'Official visual for Sales and Marketing service',
    category: 'Services',
    mediaType: 'image',
    url: 'https://i.ibb.co/60dmwRv4/Gemini-Generated-Image-5ditr65ditr65dit.jpg',
    isPublished: true,
    uploadedAt: '2026-08-30',
    usedIn: ['Services Page', 'Homepage Services']
  },
  {
    id: 'media-srv-2',
    title: 'Property Development Engine',
    description: 'Official visual for Property Development service',
    category: 'Services',
    mediaType: 'image',
    url: 'https://i.ibb.co/tTmZGbkB/Chat-GPT-Image-Aug-30-2026-07-22-04-AM.png',
    isPublished: true,
    uploadedAt: '2026-08-30',
    usedIn: ['Services Page', 'Homepage Services']
  },
  {
    id: 'media-srv-3',
    title: 'Property Management Asset Services',
    description: 'Official visual for Property Management service',
    category: 'Services',
    mediaType: 'image',
    url: 'https://i.ibb.co/0jVSfY47/Gemini-Generated-Image-qsdwq9qsdwq9qsdw.jpg',
    isPublished: true,
    uploadedAt: '2026-08-30',
    usedIn: ['Services Page', 'Homepage Services']
  },
  {
    id: 'media-srv-4',
    title: 'Investment Advisory Real Estate Analysis',
    description: 'Official visual for Investment Advisory service',
    category: 'Services',
    mediaType: 'image',
    url: 'https://i.ibb.co/JwC6Dvf1/Gemini-Generated-Image-l8v7udl8v7udl8v7.jpg',
    isPublished: true,
    uploadedAt: '2026-08-30',
    usedIn: ['Services Page', 'Homepage Services']
  },
  {
    id: 'media-srv-5',
    title: 'Land Acquisition and Documentation Support',
    description: 'Official visual for Land Acquisition service',
    category: 'Services',
    mediaType: 'image',
    url: 'https://i.ibb.co/Z6Jmqj99/Gemini-Generated-Image-8eo3z68eo3z68eo3.jpg',
    isPublished: true,
    uploadedAt: '2026-08-30',
    usedIn: ['Services Page', 'Homepage Services']
  },
  {
    id: 'media-srv-6',
    title: 'Real Estate Consultancy & Strategic Advisory',
    description: 'Official visual for Real Estate Consultancy service',
    category: 'Services',
    mediaType: 'image',
    url: 'https://i.ibb.co/GvK7p9h3/Gemini-Generated-Image-7gze9u7gze9u7gze.jpg',
    isPublished: true,
    uploadedAt: '2026-08-30',
    usedIn: ['Services Page', 'Homepage Services']
  },
  {
    id: 'media-showcase-aerial',
    title: 'Prime Gated Estate Aerial Layout',
    description: 'High-resolution aerial view of zoned residential estate layout',
    category: 'Showcase',
    mediaType: 'image',
    url: 'https://i.ibb.co/0jMMHYsD/Gemini-Generated-Image-9a20df9a20df9a20.jpg',
    isPublished: true,
    uploadedAt: '2026-10-19',
    usedIn: ['Showcase Gallery', 'Homepage Showcase']
  },
  {
    id: 'media-showcase-boardroom',
    title: 'Corporate Executive Suite & Boardroom',
    description: 'Grade-A smart corporate boardroom with panoramic views',
    category: 'Showcase',
    mediaType: 'image',
    url: 'https://i.ibb.co/vx2Kdvck/Gemini-Generated-Image-kjzs7xkjzs7xkjzs.jpg',
    isPublished: true,
    uploadedAt: '2026-10-19',
    usedIn: ['Showcase Gallery', 'Homepage Showcase']
  },
  {
    id: 'media-showcase-construction',
    title: 'Urban Master Planning & Site Construction Works',
    description: 'On-site structural development and civil engineering operations',
    category: 'Showcase',
    mediaType: 'image',
    url: 'https://i.ibb.co/212PyYPQ/Gemini-Generated-Image-fq3ktgfq3ktgfq3k.jpg',
    isPublished: true,
    uploadedAt: '2026-10-19',
    usedIn: ['Showcase Gallery', 'Homepage Showcase']
  },
  {
    id: 'media-showcase-ecocity',
    title: 'Ascent Master Planned Eco-City Infrastructure',
    description: 'Wide-angle master plan and landscaped infrastructure corridor',
    category: 'Showcase',
    mediaType: 'image',
    url: 'https://i.ibb.co/Gfnr7yrs/Gemini-Generated-Image-nqjomdnqjomdnqjo.jpg',
    isPublished: true,
    uploadedAt: '2026-10-19',
    usedIn: ['Showcase Gallery', 'Homepage Showcase']
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    fullName: 'Dr. Adeyemi Adeleke',
    email: 'adeleke.adeyemi@yahoo.co.uk',
    phone: '+234 802 345 6789',
    subject: 'Enquiry: Azure Marina Waterfront Villa',
    propertyTitle: 'Azure Marina 4-Bedroom Waterfront Villa',
    message: 'Good day. I am based in London and would like to confirm title deed availability and payment schedule for the waterfront villa.',
    status: 'New',
    createdAt: '2026-10-18T14:22:00Z'
  },
  {
    id: 'enq-102',
    fullName: 'Folashade Balogun',
    email: 'fola.balogun@investments.ng',
    phone: '+234 818 990 1122',
    subject: 'Investment Advisory - Land Banking Scheme',
    propertyTitle: 'Epe Growth Corridor Strategic Land Banking Scheme',
    message: 'Interested in acquiring 3 commercial plots along the Epe corridor for syndicated investment. Please share the prospectus.',
    status: 'Replied',
    createdAt: '2026-10-17T09:15:00Z'
  }
];

export const INITIAL_INSPECTIONS: InspectionRequest[] = [
  {
    id: 'insp-201',
    fullName: 'Chief Emeka Okonkwo',
    phone: '+234 803 777 8899',
    email: 'emeka.okonkwo@transcorpcapital.com',
    propertyTitle: 'The Emerald Bay Haven',
    preferredDate: '2026-10-24',
    preferredTime: '11:00 AM',
    numberOfVisitors: 3,
    message: 'Attending with my legal counsel and private architect to inspect the structural finishes and title documentation.',
    status: 'Pending',
    createdAt: '2026-10-19T02:45:00Z'
  },
  {
    id: 'insp-202',
    fullName: 'Mrs. Halima Danjuma',
    phone: '+234 809 111 2233',
    email: 'h.danjuma@zenithenterprises.org',
    propertyTitle: 'Crestview Pinnacle Luxury Apartments',
    preferredDate: '2026-10-22',
    preferredTime: '2:30 PM',
    numberOfVisitors: 2,
    message: 'Looking to purchase 2 units for short-let investment. Want to view the 8th floor unit.',
    status: 'Confirmed',
    createdAt: '2026-10-18T16:10:00Z'
  }
];

export const INITIAL_ACTIVITIES: AdminActivity[] = [
  {
    id: 'act-1',
    action: 'System Initialized',
    details: 'Ascent Properties and Investment Company portal live with verified assets',
    timestamp: '2026-10-19 08:00'
  },
  {
    id: 'act-2',
    action: 'Inspection Scheduled',
    details: 'Chief Emeka Okonkwo requested inspection for The Emerald Bay Haven',
    timestamp: '2026-10-19 09:45'
  },
  {
    id: 'act-3',
    action: 'Property Catalog Updated',
    details: 'Azure Marina Villa and Emerald Bay Haven high-res assets linked',
    timestamp: '2026-10-19 10:15'
  }
];
