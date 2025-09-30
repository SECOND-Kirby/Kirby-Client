/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type ThemeToken =
    | 'text'
    | 'background'
    | 'cardBackground'
    | 'primary'
    | 'primaryLight'
    | 'red'
    | 'border'
    | 'timerBackground'
    | 'timerProgress'
    | 'startButton'
    | 'pauseButton'
    | 'continueButton'
    | 'resetButton'
    | 'statCardBackground'
    | 'statValueColor'
    | 'statLabelColor'
    | 'inputBorder';

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: ThemeToken
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  const map: Record<ThemeToken, string> = {
    // 기본 텍스트/배경
    text: Colors.text.main,
    background: Colors.background.main,

    // 카드/보더
    cardBackground: Colors.background.card,
    border: Colors.border,
    inputBorder: Colors.border,

    // 브랜드 계열
    primary: Colors.primary,
    primaryLight: Colors.primaryDark, // 살짝 더 밝은 톤으로 사용

    // 상태 색
    red: Colors.error,

    // 트레이닝 화면 전용
    timerBackground: Colors.primaryDark,
    timerProgress: Colors.primary,
    startButton: Colors.primaryDark,
    pauseButton: '#FFB020',
    continueButton: Colors.primary,
    resetButton: '#D1524C',

    // 통계 카드
    statCardBackground: Colors.background.card,
    statValueColor: Colors.text.main,
    statLabelColor: Colors.text.secondary,
  };

  return map[colorName] ?? Colors.background.main;
}