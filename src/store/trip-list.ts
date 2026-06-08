import { create } from 'zustand';

export type TripStatus = 'pending_payment' | 'upcoming' | 'completed' | 'cancelled';

export interface PriceBreakdown {
  boatFee: number;
  addOnFee: number;
  deposit: number;
  total: number;
}

export interface TripRecord {
  id: string;
  scheduleId: string;
  boatName: string;
  captainName: string;
  date: string;
  time: string;
  portName: string;
  meetingPoint: string;
  meetingAddress: string;
  orderType: 'whole' | 'shared';
  personCount: number;
  bookerName: string;
  bookerPhone: string;
  companions: Array<{ name: string; phone: string }>;
  emergencyContact: { name: string; phone: string; relation: string };
  addOns: Array<{ name: string; price: number }>;
  boardingCode: string;
  priceBreakdown: PriceBreakdown;
  totalPrice: number;
  status: TripStatus;
  createdAt: number;
  paidAt?: number;
}

const PAY_TIMEOUT_MS = 15 * 60 * 1000;

interface TripListStore {
  trips: TripRecord[];
  addTrip: (trip: TripRecord) => void;
  payTrip: (tripId: string) => void;
  cancelTrip: (tripId: string) => void;
  expireTrips: () => string[];
  getTripById: (id: string) => TripRecord | undefined;
}

const STORAGE_KEY = 'hd_trip_list';

const loadTrips = (): TripRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveTrips = (trips: TripRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch {}
};

export const useTripListStore = create<TripListStore>((set, get) => ({
  trips: loadTrips(),
  addTrip: (trip) => {
    set((state) => {
      const next = [trip, ...state.trips];
      saveTrips(next);
      return { trips: next };
    });
  },
  payTrip: (tripId) => {
    set((state) => {
      const next = state.trips.map((t) =>
        t.id === tripId ? { ...t, status: 'upcoming' as const, paidAt: Date.now() } : t
      );
      saveTrips(next);
      return { trips: next };
    });
  },
  cancelTrip: (tripId) => {
    set((state) => {
      const next = state.trips.map((t) =>
        t.id === tripId ? { ...t, status: 'cancelled' as const } : t
      );
      saveTrips(next);
      return { trips: next };
    });
  },
  expireTrips: () => {
    const now = Date.now();
    const expiredIds: string[] = [];
    set((state) => {
      const next = state.trips.map((t) => {
        if (t.status === 'pending_payment' && now - t.createdAt > PAY_TIMEOUT_MS) {
          expiredIds.push(t.id);
          return { ...t, status: 'cancelled' as const };
        }
        return t;
      });
      saveTrips(next);
      return { trips: next };
    });
    return expiredIds;
  },
  getTripById: (id) => get().trips.find((t) => t.id === id),
}));

export { PAY_TIMEOUT_MS };
