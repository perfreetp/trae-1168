import { create } from 'zustand';

export interface TripStoreState {
  boatName: string;
  captainName: string;
  date: string;
  time: string;
  portName: string;
  meetingPoint: string;
  meetingAddress: string;
  orderType: 'whole' | 'shared';
  personCount: number;
  companions: Array<{ name: string; phone: string }>;
  addOns: Array<{ name: string; price: number }>;
  boardingCode: string;
}

const defaultState: TripStoreState = {
  boatName: '海风号',
  captainName: '张海明',
  date: '2026-06-09',
  time: '06:00 - 14:00',
  portName: '嵊泗列岛港',
  meetingPoint: '嵊泗列岛港3号码头',
  meetingAddress: '浙江省舟山市嵊泗县菜园镇基湖村',
  orderType: 'shared',
  personCount: 1,
  companions: [],
  addOns: [],
  boardingCode: 'HD20260609',
};

interface TripStore {
  tripData: TripStoreState;
  setTripData: (data: Partial<TripStoreState>) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  tripData: defaultState,
  setTripData: (data) =>
    set((state) => ({
      tripData: { ...state.tripData, ...data },
    })),
}));
