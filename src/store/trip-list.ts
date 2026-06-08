import { create } from 'zustand';

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
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: number;
}

interface TripListStore {
  trips: TripRecord[];
  addTrip: (trip: TripRecord) => void;
  cancelTrip: (tripId: string) => void;
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
  cancelTrip: (tripId) => {
    set((state) => {
      const next = state.trips.map((t) =>
        t.id === tripId ? { ...t, status: 'cancelled' as const } : t
      );
      saveTrips(next);
      return { trips: next };
    });
  },
  getTripById: (id) => get().trips.find((t) => t.id === id),
}));
