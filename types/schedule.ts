// types/schedule.ts
export interface Schedule {
  id: string;
  title: string;
  date: string; // ISO 형식
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  isAllDay: boolean;
  memo?: string;
}

export interface CalendarDate {
  day: number;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
}

export interface CalendarData {
  calendar: CalendarDate[][];
  today: number | null;
  month: number;
  year: number;
}