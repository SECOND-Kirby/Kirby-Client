// hooks/useHomeCalendar.ts
import { useMemo } from 'react';
import { CalendarData } from '@/types/schedule';

interface UseHomeCalendarProps {
    currentMonth: number;
    currentYear: number;
}

export const useHomeCalendar = ({ currentMonth, currentYear }: UseHomeCalendarProps) => {
    const calendarData: CalendarData = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth - 1, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendar: CalendarData['calendar'] = [];

        for (let week = 0; week < 6; week++) {
            const weekDates = [];
            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + week * 7 + day);

                weekDates.push({
                    day: date.getDate(),
                    isCurrentMonth: date.getMonth() === currentMonth - 1,
                    isPrevMonth: date.getMonth() < currentMonth - 1,
                });
            }
            calendar.push(weekDates);
        }

        const today = new Date();
        const todayDate =
            today.getMonth() + 1 === currentMonth && today.getFullYear() === currentYear
                ? today.getDate()
                : null;

        return {
            calendar,
            today: todayDate,
            month: currentMonth,
            year: currentYear,
        };
    }, [currentMonth, currentYear]);

    return calendarData;
};