// types/schedule.ts
export interface Schedule {
  id: string;
  title: string;
  date: string; // ISO 형식 (YYYY-MM-DD)
  startTime: string; // "HH:MM:SS"
  endTime: string; // "HH:MM:SS"
  isAllDay: boolean;
  memo?: string;

  // 반복 정보
  isRepeating?: boolean;
  recurringScheduleId?: string;
  repeatDays?: RepeatDay[];
  repeatEndDate?: string; // ISO 형식 (YYYY-MM-DD)
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

// 수정/삭제 범위
export type UpdateScope = 'THIS_ONLY' | 'THIS_AND_FUTURE' | 'ALL';
export type DeleteScope = 'THIS_ONLY' | 'THIS_AND_FUTURE' | 'ALL';

export const DAY_OF_WEEK_OPTIONS: DayOfWeek[] = [
  { key: 'mon', label: '월', isSelected: false },
  { key: 'tue', label: '화', isSelected: false },
  { key: 'wed', label: '수', isSelected: false },
  { key: 'thu', label: '목', isSelected: false },
  { key: 'fri', label: '금', isSelected: false },
  { key: 'sat', label: '토', isSelected: false },
  { key: 'sun', label: '일', isSelected: false },
];

// 프론트-백엔드 요일 매핑
export const REPEAT_DAY_MAPPING: Record<RepeatDay, string> = {
  mon: 'MONDAY',
  tue: 'TUESDAY',
  wed: 'WEDNESDAY',
  thu: 'THURSDAY',
  fri: 'FRIDAY',
  sat: 'SATURDAY',
  sun: 'SUNDAY',
};

export const BACKEND_TO_FRONTEND_DAY: Record<string, RepeatDay> = {
  MONDAY: 'mon',
  TUESDAY: 'tue',
  WEDNESDAY: 'wed',
  THURSDAY: 'thu',
  FRIDAY: 'fri',
  SATURDAY: 'sat',
  SUNDAY: 'sun',
};