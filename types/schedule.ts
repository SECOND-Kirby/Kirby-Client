// types/schedule.ts
export interface Schedule {
  id: string;
  title: string;
  date: string; // ISO 형식
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  isAllDay: boolean;
  memo?: string;
  repeatDays?: RepeatDay[]; // 반복 요일
}

export type RepeatDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface DayOfWeek {
  key: RepeatDay;
  label: string;
  isSelected: boolean;
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

export const DAY_OF_WEEK_OPTIONS: DayOfWeek[] = [
  { key: 'mon', label: '월', isSelected: false },
  { key: 'tue', label: '화', isSelected: false },
  { key: 'wed', label: '수', isSelected: false },
  { key: 'thu', label: '목', isSelected: false },
  { key: 'fri', label: '금', isSelected: false },
  { key: 'sat', label: '토', isSelected: false },
  { key: 'sun', label: '일', isSelected: false },
];