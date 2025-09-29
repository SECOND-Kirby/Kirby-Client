import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Schedule } from '@/types/schedule';
import { logInfo, logError } from '@/utils/logger';

interface ScheduleState {
  schedules: Schedule[];
  selectedDate: number | null;
  currentMonth: number;
  currentYear: number;
  isLoading: boolean;
  error: string | null;
}

interface ScheduleActions {
  setSchedules: (schedules: Schedule[]) => void;
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  setSelectedDate: (date: number | null) => void;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  loadSchedules: () => Promise<void>;
  saveSchedules: () => Promise<void>;
  clearError: () => void;
  getSchedulesForDate: (date: number, month: number, year: number) => Schedule[];
  getNextSchedule: () => Schedule | null;
}

type ScheduleStore = ScheduleState & ScheduleActions;

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      schedules: [],
      selectedDate: null,
      currentMonth: new Date().getMonth() + 1,
      currentYear: new Date().getFullYear(),
      isLoading: false,
      error: null,

      // 액션들
      setSchedules: (schedules: Schedule[]): void => {
        set({ schedules });
        get().saveSchedules();
      },

      addSchedule: (schedule: Schedule): void => {
        const { schedules } = get();
        const newSchedules = [...schedules, schedule];
        set({ schedules: newSchedules });
        get().saveSchedules();
        logInfo('SCHEDULE_ADD', '새 일정 추가', { id: schedule.id, title: schedule.title });
      },

      updateSchedule: (id: string, updates: Partial<Schedule>): void => {
        const { schedules } = get();
        const newSchedules = schedules.map(schedule =>
          schedule.id === id ? { ...schedule, ...updates } : schedule
        );
        set({ schedules: newSchedules });
        get().saveSchedules();
        logInfo('SCHEDULE_UPDATE', '일정 수정', { id, updates });
      },

      deleteSchedule: (id: string): void => {
        const { schedules } = get();
        const newSchedules = schedules.filter(schedule => schedule.id !== id);
        set({ schedules: newSchedules });
        get().saveSchedules();
        logInfo('SCHEDULE_DELETE', '일정 삭제', { id });
      },

      setSelectedDate: (date: number | null): void => {
        set({ selectedDate: date });
      },

      setCurrentMonth: (month: number): void => {
        set({ currentMonth: month });
      },

      setCurrentYear: (year: number): void => {
        set({ currentYear: year });
      },

      loadSchedules: async (): Promise<void> => {
        set({ isLoading: true, error: null });
        
        try {
          const storedSchedules = await AsyncStorage.getItem('schedules');
          if (storedSchedules) {
            const schedules = JSON.parse(storedSchedules);
            set({ schedules, isLoading: false });
            logInfo('SCHEDULE_LOAD', '일정 로드 완료', { count: schedules.length });
          } else {
            set({ schedules: [], isLoading: false });
          }
        } catch (error: any) {
          const errorMessage = '일정 로드 중 오류가 발생했습니다.';
          set({ error: errorMessage, isLoading: false });
          logError('SCHEDULE_LOAD_ERROR', errorMessage, error);
        }
      },

      saveSchedules: async (): Promise<void> => {
        try {
          const { schedules } = get();
          await AsyncStorage.setItem('schedules', JSON.stringify(schedules));
          logInfo('SCHEDULE_SAVE', '일정 저장 완료', { count: schedules.length });
        } catch (error: any) {
          logError('SCHEDULE_SAVE_ERROR', '일정 저장 중 오류 발생', error);
        }
      },

      clearError: (): void => {
        set({ error: null });
      },

      getSchedulesForDate: (date: number, month: number, year: number): Schedule[] => {
        const { schedules } = get();
        return schedules.filter(schedule => {
          const scheduleDate = new Date(schedule.date);
          return scheduleDate.getDate() === date &&
                 scheduleDate.getMonth() + 1 === month &&
                 scheduleDate.getFullYear() === year;
        });
      },

      getNextSchedule: (): Schedule | null => {
        const { schedules } = get();
        const now = new Date();
        
        const upcomingSchedules = schedules
          .filter(schedule => new Date(schedule.date) > now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        return upcomingSchedules[0] || null;
      },
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        schedules: state.schedules,
        currentMonth: state.currentMonth,
        currentYear: state.currentYear,
      }),
    }
  )
);
