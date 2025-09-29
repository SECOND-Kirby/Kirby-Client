// 공통 타입 정의
export interface Schedule {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  duration?: string;
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

export interface TrainingParams {
  duration: string;
  mode: string;
  difficulty: string;
  ballCount: string;
}
