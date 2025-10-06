// constants/Colors.ts - 스케줄 관련 색상 추가
export const Colors = {
  // 브랜드 컬러
  primary: '#A4D65E',
  primaryDark: '#9DE84C',

  // 배경
  background: {
    main: '#F9FAFA',
    card: '#FFFFFF',
    button: '#D9D9D9',
    progressBar: '#D9D9D9',
    neon: '#F6F7F9',
    weekday: '#F4C6C6',
    modalOverlay: 'rgba(0,0,0,0.35)',
    aiFeedback: '#E6FFE4',
    scheduleHighlight: '#E8F5E8',
  },

  // 텍스트
  text: {
    main: '#333740',
    secondary: '#6E6E6E',
    ruleItem: '#666666',
    white: '#FFFFFF',
    dark: '#111',
    medium: '#555',
    gray: '#999',
    lightGray: '#ccc',
  },

  // 요일
  days: {
    saturday: '#5D69F3',
    sunday: '#F46C6C',
  },

  // 위험/경고
  danger: {
    main: '#D1524C',
    background: '#FFF5F5',
    border: '#fecaca',
  },

  // 아이콘
  icon: {
    secondary: '#888888',
    white: '#FFFFFF',
    placeholder: '#999999',
    arrow: '#CCCCCC',
  },

  // 체크박스
  checkbox: {
    border: '#E0E0E0',
  },

  // 프로필
  profile: {
    background: '#E0E0E0',
    cameraBorder: '#E0E0E0',
  },

  // 비밀번호
  password: {
    ruleBackground: '#F8F8F8',
  },

  // 메뉴
  menu: {
    border: '#F0F0F0',
  },

  // 트레이닝
  training: {
    timer: '#9DE84C',
    progress: '#9DE84C',
    start: '#9DE84C',
    pause: '#FFB020',
    continue: '#9DE84C',
    reset: '#D1524C',
    aiFeedbackBorder: '#5CB33D',
    aiFeedbackTitle: '#527D40',
  },

  // 버튼
  button: {
    lightGray: '#e5e7eb',
    darkGray: '#111827',
    background: '#F5F5F5',
  },

  // 스케줄
  schedule: {
    delete: '#FF6B6B',
    deleteBackground: '#FFF5F5',
  },

  // 공통
  border: '#E4EAE9',
  register: '#103D5E',
  error: '#FF4444',
  disabled: '#F0F0F0',
} as const;