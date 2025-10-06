// utils/dateUtils.ts
import { Schedule } from '@/types/schedule';

// 날짜를 로컬 타임존 기준 YYYY-MM-DD 문자열로 변환
export const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 순수 날짜 유틸리티
export const isSameDate = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

export const createDateStart = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const navigateMonth = (
    currentMonth: number,
    currentYear: number,
    direction: 'prev' | 'next'
): { month: number; year: number } => {
    let newMonth = direction === 'next' ? currentMonth + 1 : currentMonth - 1;
    let newYear = currentYear;

    if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
    } else if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
    }

    return { month: newMonth, year: newYear };
};

// Schedule 관련 유틸리티
export const getTodaySchedules = (schedules: Schedule[]): Schedule[] => {
    const today = createDateStart(new Date());

    return schedules
        .filter(schedule => {
            const scheduleDate = createDateStart(new Date(schedule.date));
            return scheduleDate.getTime() === today.getTime();
        })
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
};

export const getSchedulesForDate = (
    schedules: Schedule[],
    day: number,
    month: number,
    year: number
): Schedule[] => {
    return schedules
        .filter(schedule => {
            const scheduleDate = new Date(schedule.date);
            return (
                scheduleDate.getDate() === day &&
                scheduleDate.getMonth() + 1 === month &&
                scheduleDate.getFullYear() === year
            );
        })
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
};