// constants/Colors.ts
export const Colors = {
  // 메인 브랜드 컬러
  primary: '#9DE84C',
  primaryDark: '#9DE84C',

  // 배경색
  background: {
    main: '#F9FAFA',
    card: '#FFFFFF',
    button: '#D9D9D9',
    progressBar: '#D9D9D9',
    neon: '#F6F7F9',
    weekday: '#F4C6C6',
  },

  // 텍스트 컬러
  text: {
    main: '#333740',
    secondary: '#6E6E6E',
  },

  // 요일 컬러
  days: {
    saturday: '#5D69F3',
    sunday: '#F46C6C',
  },

  // 기타
  border: '#E4EAE9',
  register: '#103D5E',
  error: '#FF4444',
  disabled: '#F0F0F0',
} as const;