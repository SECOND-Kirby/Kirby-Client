// utils/errorHandler.ts
import { ERROR_CODES } from '@/constants';

export interface ApiError {
  response?: {
    data?: {
      success: boolean;
      code: string;
      message: string;
      data?: any;
    };
    status?: number;
  };
  message?: string;
}

export interface FieldErrors {
  [key: string]: string;
}

export interface ErrorHandlingResult {
  message: string;
  fieldErrors?: FieldErrors;
  shouldShowAlert: boolean;
}

export const handleApiError = (error: unknown, context: string = 'API 호출'): ErrorHandlingResult => {
  console.error(`${context} 에러:`, error);

  const apiError = error as ApiError;
  let message = `${context} 중 오류가 발생했습니다.`;
  let fieldErrors: FieldErrors = {};
  let shouldShowAlert = true;

  if (apiError.response?.data) {
    const errorData = apiError.response.data;

    switch (errorData.code) {
      case ERROR_CODES.INVALID_TOKEN:
        message = '유효하지 않은 토큰입니다. 다시 로그인해주세요.';
        break;
      case ERROR_CODES.TOKEN_EXPIRED:
        message = '토큰이 만료되었습니다. 다시 로그인해주세요.';
        break;
      case ERROR_CODES.UNAUTHORIZED:
        message = '인증이 필요합니다. 로그인해주세요.';
        break;
      case ERROR_CODES.USER_NOT_FOUND:
        message = '사용자를 찾을 수 없습니다.';
        break;
      case ERROR_CODES.USERNAME_ALREADY_EXISTS:
        message = '이미 사용중인 아이디입니다.';
        fieldErrors.username = '이미 사용중인 아이디입니다.';
        break;
      case ERROR_CODES.EMAIL_ALREADY_EXISTS:
        message = '이미 등록된 이메일입니다.';
        fieldErrors.email = '이미 등록된 이메일입니다.';
        break;
      case ERROR_CODES.PHONE_NUMBER_ALREADY_EXISTS:
        message = '이미 등록된 전화번호입니다.';
        fieldErrors.phoneNumber = '이미 등록된 전화번호입니다.';
        break;
      case ERROR_CODES.INVALID_PASSWORD:
        message = '현재 비밀번호가 일치하지 않습니다.';
        fieldErrors.currentPassword = '현재 비밀번호가 일치하지 않습니다.';
        break;
      case ERROR_CODES.PASSWORD_MISMATCH:
        message = '비밀번호가 일치하지 않습니다.';
        fieldErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        break;
      case ERROR_CODES.SAME_AS_CURRENT_PASSWORD:
        message = '새 비밀번호가 현재 비밀번호와 동일합니다.';
        fieldErrors.newPassword = '새 비밀번호가 현재 비밀번호와 동일합니다.';
        break;
      case ERROR_CODES.INVALID_INPUT_VALUE:
        if (errorData.data && typeof errorData.data === 'object') {
          fieldErrors = errorData.data as FieldErrors;
          message = '입력값을 확인해주세요.';
        } else {
          message = errorData.message || '입력값이 올바르지 않습니다.';
        }
        break;
      case ERROR_CODES.INTERNAL_SERVER_ERROR:
        message = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        break;
      default:
        message = errorData.message || message;
        console.warn('처리되지 않은 에러 코드:', errorData.code);
    }
  } else if (apiError.message) {
    message = `네트워크 오류가 발생했습니다.\n${apiError.message}`;
  }

  return {
    message,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    shouldShowAlert
  };
};

export const getContextualErrorMessage = (error: unknown, context: string): string => {
  const result = handleApiError(error, context);
  return result.message;
};

export const extractFieldErrors = (error: unknown): FieldErrors => {
  const result = handleApiError(error);
  return result.fieldErrors || {};
};