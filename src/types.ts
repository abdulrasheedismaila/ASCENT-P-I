export interface Property {
  id: string;
  title: string;
  slug: string;
  price: number;
  formattedPrice: string;
  location: string;
  city: string;
  state: string;
  type: 'Residential' | 'Duplexes' | 'Apartments' | 'Land' | 'Commercial' | 'Office spaces' | 'Estates';
  purpose: 'Buy' | 'Rent' | 'Investment';
  size: string;
  bedrooms?: number;
  bathrooms?: number;
  featured: boolean;
  availability: 'Available' | 'Sold Out' | 'Under Offer';
  coverImage: string;
  images: string[];
  description: string;
  features: string[];
  titleDeed?: string;
  yearBuilt?: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  coverImage: string;
  images: string[];
  videos?: string[];
  location: string;
  description: string;
  type: 'Residential Estate' | 'Luxury High-Rise' | 'Mixed-Use Commercial' | 'Waterfront Villas';
  status: 'Planning' | 'Ongoing' | 'Completed' | 'Coming Soon';
  progress?: number;
  features: string[];
  availableUnits?: string;
  deliveryDate?: string;
  createdAt: string;
}

export interface InvestmentOpportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  minInvestment: string;
  investmentPeriod: string;
  projectedReturn?: string;
  payoutFrequency?: string;
  projectInfo: string;
  supportingImages: string[];
  documents?: { name: string; url: string; size: string }[];
  status: 'Active' | 'Closing Soon' | 'Fully Funded';
  createdAt: string;
}

export interface CompanyService {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  features: string[];
  scope: string;
}

export interface ShowcaseItem {
  id: string;
  title: string;
  category: 'Properties' | 'Projects' | 'Interiors' | 'Exteriors' | 'Construction' | 'Videos';
  mediaType: 'image' | 'video';
  url: string;
  thumbnail?: string;
  description: string;
  location?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  category: 'Hero' | 'Properties' | 'Projects' | 'Services' | 'Showcase' | 'General';
  mediaType: 'image' | 'video';
  url: string;
  thumbnail?: string;
  size?: string;
  isPublished: boolean;
  uploadedAt: string;
  usedIn?: string[];
}

export interface Enquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  propertyTitle?: string;
  status: 'New' | 'Replied' | 'Archived';
  createdAt: string;
}

export interface InspectionRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  propertyTitle: string;
  preferredDate: string;
  preferredTime: string;
  numberOfVisitors: number;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface SiteSettings {
  companyName: string;
  logoUrl: string;
  heroHeadline: string;
  heroSupportingText: string;
  heroBackground: string;
  email: string;
  phone: string;
  whatsapp: string;
  officeAddress: string;
  businessHours: string;
  socials: {
    tiktok: string;
    facebook: string;
    x: string;
    instagram: string;
    email: string;
  };
}

export interface AdminActivity {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}
