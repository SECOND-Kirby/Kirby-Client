// store/scheduleStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Schedule, UpdateScope, DeleteScope } from '@/types/schedule';
import { scheduleService } from '@/services/scheduleService';
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
    addSchedule: (schedule: Omit<Schedule, 'id'>) => Promise<void>;
    updateSchedule: (id: string, updates: Partial<Schedule>, scope?: UpdateScope) => Promise<void>;
    deleteSchedule: (id: string, scope?: DeleteScope) => Promise<void>;
    setSelectedDate: (date: number | null) => void;
    setCurrentMonth: (month: number) => void;
    setCurrentYear: (year: number) => void;
    loadSchedules: () => Promise<void>;
    loadSchedulesByMonth: (year: number, month: number) => Promise<void>;
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

            setSchedules: (schedules: Schedule[]): void => {
                set({ schedules });
            },

            // 일정 생성
            addSchedule: async (schedule: Omit<Schedule, 'id'>): Promise<void> => {
                set({ isLoading: true, error: null });

                try {
                    const response = await scheduleService.createSchedule(schedule);

                    if (response.success && response.data) {
                        // 반복 일정인 경우 해당 월의 모든 일정을 다시 로드
                        if (schedule.repeatDays && schedule.repeatDays.length > 0) {
                            const { currentMonth, currentYear } = get();
                            await get().loadSchedulesByMonth(currentYear, currentMonth);
                        } else {
                            // 일반 일정은 리스트에 추가
                            const { schedules } = get();
                            set({ schedules: [...schedules, response.data], isLoading: false });
                        }

                        logInfo('SCHEDULE_ADD', '새 일정 추가', {
                            id: response.data.id,
                            isRepeating: response.data.isRepeating
                        });
                    } else {
                        throw new Error(response.message || '일정 생성 실패');
                    }
                } catch (error: any) {
                    const errorMessage = error.message || '일정 추가 중 오류가 발생했습니다.';
                    set({ error: errorMessage, isLoading: false });
                    logError('SCHEDULE_ADD_ERROR', errorMessage, error);
                    throw error;
                }
            },

            // 일정 수정
            updateSchedule: async (
                id: string,
                updates: Partial<Schedule>,
                scope: UpdateScope = 'THIS_ONLY'
            ): Promise<void> => {
                set({ isLoading: true, error: null });

                try {
                    const response = await scheduleService.updateSchedule(id, updates, scope);

                    if (response.success) {
                        // 전체/이후 수정인 경우 해당 월 다시 로드
                        if (scope !== 'THIS_ONLY') {
                            const { currentMonth, currentYear } = get();
                            await get().loadSchedulesByMonth(currentYear, currentMonth);
                        } else {
                            // 개별 수정은 로컬 업데이트
                            const { schedules } = get();
                            const newSchedules = schedules.map(schedule =>
                                schedule.id === id ? { ...schedule, ...updates } : schedule
                            );
                            set({ schedules: newSchedules, isLoading: false });
                        }

                        logInfo('SCHEDULE_UPDATE', '일정 수정', { id, scope });
                    } else {
                        throw new Error(response.message || '일정 수정 실패');
                    }
                } catch (error: any) {
                    const errorMessage = error.message || '일정 수정 중 오류가 발생했습니다.';
                    set({ error: errorMessage, isLoading: false });
                    logError('SCHEDULE_UPDATE_ERROR', errorMessage, error);
                    throw error;
                }
            },

            // 일정 삭제
            deleteSchedule: async (
                id: string,
                scope: DeleteScope = 'THIS_ONLY'
            ): Promise<void> => {
                set({ isLoading: true, error: null });

                try {
                    const response = await scheduleService.deleteSchedule(id, scope);

                    if (response.success) {
                        // 전체/이후 삭제인 경우 해당 월 다시 로드
                        if (scope !== 'THIS_ONLY') {
                            const { currentMonth, currentYear } = get();
                            await get().loadSchedulesByMonth(currentYear, currentMonth);
                        } else {
                            // 개별 삭제는 로컬에서 제거
                            const { schedules } = get();
                            const newSchedules = schedules.filter(schedule => schedule.id !== id);
                            set({ schedules: newSchedules, isLoading: false });
                        }

                        logInfo('SCHEDULE_DELETE', '일정 삭제', { id, scope });
                    } else {
                        throw new Error(response.message || '일정 삭제 실패');
                    }
                } catch (error: any) {
                    const errorMessage = error.message || '일정 삭제 중 오류가 발생했습니다.';
                    set({ error: errorMessage, isLoading: false });
                    logError('SCHEDULE_DELETE_ERROR', errorMessage, error);
                    throw error;
                }
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

            // 월별 일정 로드
            loadSchedulesByMonth: async (year: number, month: number): Promise<void> => {
                set({ isLoading: true, error: null });

                try {
                    // 1. 해당 월의 일정이 있는 날짜 목록 조회
                    const datesResponse = await scheduleService.getScheduleDatesInMonth(year, month);

                    if (!datesResponse.success || !datesResponse.data) {
                        set({ schedules: [], isLoading: false });
                        return;
                    }

                    // 2. 각 날짜별로 일정 조회
                    const allSchedules: Schedule[] = [];
                    for (const date of datesResponse.data) {
                        const schedulesResponse = await scheduleService.getSchedulesByDate(date);
                        if (schedulesResponse.success && schedulesResponse.data) {
                            allSchedules.push(...schedulesResponse.data);
                        }
                    }

                    set({ schedules: allSchedules, isLoading: false });
                    logInfo('SCHEDULE_LOAD_MONTH', '월별 일정 로드', { year, month, count: allSchedules.length });
                } catch (error: any) {
                    const errorMessage = '일정 로드 중 오류가 발생했습니다.';
                    set({ error: errorMessage, isLoading: false, schedules: [] });
                    logError('SCHEDULE_LOAD_ERROR', errorMessage, error);
                }
            },

            // 현재 월 일정 로드
            loadSchedules: async (): Promise<void> => {
                const { currentMonth, currentYear } = get();
                await get().loadSchedulesByMonth(currentYear, currentMonth);
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
                currentMonth: state.currentMonth,
                currentYear: state.currentYear,
                // schedules는 제외 (API에서 로드)
            }),
        }
    )
);