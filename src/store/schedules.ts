import { create } from 'zustand';
import type { Schedule } from '@/types';
import { schedules as initialSchedules } from '@/data/schedules';

interface ScheduleStore {
  schedules: Schedule[];
  decreaseSeats: (scheduleId: string, count: number) => void;
  increaseSeats: (scheduleId: string, count: number) => void;
  getScheduleById: (id: string) => Schedule | undefined;
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: initialSchedules.map((s) => ({ ...s })),
  decreaseSeats: (scheduleId, count) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === scheduleId
          ? { ...s, availableSeats: Math.max(0, s.availableSeats - count) }
          : s
      ),
    })),
  increaseSeats: (scheduleId, count) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === scheduleId
          ? { ...s, availableSeats: Math.min(s.totalSeats, s.availableSeats + count) }
          : s
      ),
    })),
  getScheduleById: (id) => get().schedules.find((s) => s.id === id),
}));
