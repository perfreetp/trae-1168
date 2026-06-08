export interface Port {
  id: string;
  name: string;
  location: string;
  image: string;
  boatCount: number;
}

export interface FishSpecies {
  id: string;
  name: string;
  season: string;
  image: string;
}

export interface Boat {
  id: string;
  name: string;
  captain: string;
  captainAvatar: string;
  captainYears: number;
  captainLicense: string;
  type: string;
  capacity: number;
  length: number;
  speed: number;
  portId: string;
  portName: string;
  rating: number;
  reviewCount: number;
  price: number;
  sharedPrice: number;
  equipment: string[];
  photos: string[];
  description: string;
}

export interface Schedule {
  id: string;
  boatId: string;
  boatName: string;
  boatType: string;
  portName: string;
  date: string;
  startTime: string;
  endTime: string;
  tide: string;
  tideLevel: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  sharedPrice: number;
  fishTypes: string[];
  image: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
  images: string[];
}

export interface Message {
  id: string;
  type: 'reschedule' | 'cancel' | 'group' | 'notice';
  title: string;
  content: string;
  time: string;
  read: boolean;
  boatName?: string;
  date?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'refunding' | 'refunded' | 'grouped' | 'forming';
  groupTotal?: number;
  groupCurrent?: number;
  refundProgress?: number;
}

export interface Order {
  id: string;
  scheduleId: string;
  boatName: string;
  date: string;
  time: string;
  type: 'whole' | 'shared';
  companions: Companion[];
  emergencyContact: EmergencyContact;
  addOns: AddOnItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Companion {
  name: string;
  phone: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  selected: boolean;
}

export interface Trip {
  id: string;
  orderId: string;
  boatName: string;
  captainName: string;
  date: string;
  time: string;
  meetingPoint: string;
  meetingLat: number;
  meetingLng: number;
  boardingCode: string;
  notes: string[];
  captainNotices: CaptainNotice[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface CaptainNotice {
  id: string;
  content: string;
  time: string;
}

export interface WeatherInfo {
  temperature: number;
  weather: string;
  windDirection: string;
  windLevel: number;
  tide: string;
  tideTime: string;
  suitability: 'good' | 'moderate' | 'poor';
}
