// services/scheduleService.ts
import http from './http';
import { Schedule, UpdateScope, DeleteScope, REPEAT_DAY_MAPPING, BACKEND_TO_FRONTEND_DAY } from '@/types/schedule';

interface ScheduleResponse<T = any> {
    success: boolean;
    code: string;
    message: string;
    data: T | null;
}

// 백엔드 응답 타입
interface BackendSchedule {
    id: number;
    title: string;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    memo?: string;
    isRepeating?: boolean;
    recurringScheduleId?: number;
    repeatDays?: string[];
    repeatEndDate?: string;
}

export const scheduleService = {
    /**
     * 일정 생성
     */
    async createSchedule(schedule: Omit<Schedule, 'id'>): Promise<ScheduleResponse<Schedule>> {
        // 반복 설정 검증
        if (schedule.repeatDays && schedule.repeatDays.length > 0) {
            if (!schedule.repeatEndDate) {
                throw new Error('반복 종료 날짜는 필수입니다.');
            }
        }

        // 프론트엔드 → 백엔드 포맷 변환
        const requestBody = {
            title: schedule.title,
            scheduleDate: schedule.date,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            memo: schedule.memo || null,
            repeatDays: schedule.repeatDays?.map(day => REPEAT_DAY_MAPPING[day]),
            repeatEndDate: schedule.repeatEndDate || null,
        };

        const response = await http.post<ScheduleResponse<BackendSchedule>>(
            '/api/schedules',
            requestBody
        );

        if (response.data.success && response.data.data) {
            return {
                ...response.data,
                data: this.convertBackendToFrontend(response.data.data),
            };
        }

        return response.data as any;
    },

    /**
     * 특정 날짜 일정 조회
     */
    async getSchedulesByDate(date: string): Promise<ScheduleResponse<Schedule[]>> {
        const response = await http.get<ScheduleResponse<BackendSchedule[]>>(
            `/api/schedules?date=${date}`
        );

        if (response.data.success && response.data.data) {
            return {
                ...response.data,
                data: response.data.data.map(s => this.convertBackendToFrontend(s)),
            };
        }

        return response.data as any;
    },

    /**
     * 월별 일정 날짜 목록 조회
     */
    async getScheduleDatesInMonth(year: number, month: number): Promise<ScheduleResponse<string[]>> {
        const response = await http.get<ScheduleResponse<string[]>>(
            `/api/schedules/dates?year=${year}&month=${month}`
        );
        return response.data;
    },

    /**
     * 일정 수정
     */
    async updateSchedule(
        id: string,
        updates: Partial<Schedule>,
        updateScope: UpdateScope = 'THIS_ONLY'
    ): Promise<ScheduleResponse<Schedule>> {
        const requestBody = {
            title: updates.title,
            scheduleDate: updates.date,
            startTime: updates.startTime,
            endTime: updates.endTime,
            memo: updates.memo || null,
            updateScope,
        };

        const response = await http.put<ScheduleResponse<BackendSchedule>>(
            `/api/schedules/${id}`,
            requestBody
        );

        if (response.data.success && response.data.data) {
            return {
                ...response.data,
                data: this.convertBackendToFrontend(response.data.data),
            };
        }

        return response.data as any;
    },

    /**
     * 일정 삭제
     */
    async deleteSchedule(
        id: string,
        deleteScope: DeleteScope = 'THIS_ONLY'
    ): Promise<ScheduleResponse<void>> {
        const response = await http.delete<ScheduleResponse<void>>(
            `/api/schedules/${id}?deleteScope=${deleteScope}`
        );
        return response.data;
    },

    /**
     * 백엔드 → 프론트엔드 포맷 변환
     */
    convertBackendToFrontend(backend: BackendSchedule): Schedule {
        return {
            id: backend.id.toString(),
            title: backend.title,
            date: backend.scheduleDate,
            startTime: backend.startTime,
            endTime: backend.endTime,
            isAllDay: false, // 백엔드에서 지원하지 않으므로 기본값
            memo: backend.memo,
            isRepeating: backend.isRepeating,
            recurringScheduleId: backend.recurringScheduleId?.toString(),
            repeatDays: backend.repeatDays?.map(day => BACKEND_TO_FRONTEND_DAY[day]),
            repeatEndDate: backend.repeatEndDate,
        };
    },
};