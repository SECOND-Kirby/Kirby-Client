/**
 * 프로덕션 환경에서 안전한 로깅 시스템
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    // 개발 환경에서는 모든 로그를, 프로덕션에서는 ERROR만
    this.logLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.ERROR;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  public debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  public info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }

  public warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  public error(message: string, error?: Error | unknown, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }
  }

  // API 관련 로깅
  public apiRequest(method: string, url: string, data?: any): void {
    this.debug(`API Request: ${method} ${url}`, data);
  }

  public apiResponse(method: string, url: string, status: number, data?: any): void {
    this.debug(`API Response: ${method} ${url} - ${status}`, data);
  }

  public apiError(method: string, url: string, error: unknown): void {
    this.error(`API Error: ${method} ${url}`, error);
  }

  // 사용자 액션 로깅
  public userAction(action: string, data?: any): void {
    this.info(`User Action: ${action}`, data);
  }

  // 인증 관련 로깅
  public authAction(action: string, data?: any): void {
    this.info(`Auth Action: ${action}`, data);
  }
}

// 싱글톤 인스턴스 내보내기
export const logger = Logger.getInstance();

// 편의 함수들
export const logDebug = (message: string, ...args: any[]) => logger.debug(message, ...args);
export const logInfo = (message: string, ...args: any[]) => logger.info(message, ...args);
export const logWarn = (message: string, ...args: any[]) => logger.warn(message, ...args);
export const logError = (message: string, error?: Error | unknown, ...args: any[]) => logger.error(message, error, ...args);

export const logApiRequest = (method: string, url: string, data?: any) => logger.apiRequest(method, url, data);
export const logApiResponse = (method: string, url: string, status: number, data?: any) => logger.apiResponse(method, url, status, data);
export const logApiError = (method: string, url: string, error: unknown) => logger.apiError(method, url, error);

export const logUserAction = (action: string, data?: any) => logger.userAction(action, data);
export const logAuthAction = (action: string, data?: any) => logger.authAction(action, data);
