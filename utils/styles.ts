// utils/styles.ts
import { Platform, ViewStyle } from 'react-native';

/**
 * 플랫폼별 그림자 스타일 생성
 * @param color - 그림자 색상 (기본: '#000')
 * @param offsetX - X축 오프셋 (기본: 0)
 * @param offsetY - Y축 오프셋 (기본: 2)
 * @param opacity - 불투명도 (기본: 0.1)
 * @param radius - 블러 반경 (기본: 4)
 * @param elevation - Android elevation (기본: 3)
 */
export const createShadow = (
    color: string = '#000',
    offsetX: number = 0,
    offsetY: number = 2,
    opacity: number = 0.1,
    radius: number = 4,
    elevation: number = 3
): ViewStyle => {
    return Platform.select({
        web: {
            boxShadow: `${offsetX}px ${offsetY}px ${radius}px rgba(0, 0, 0, ${opacity})`,
        } as ViewStyle,
        default: {
            shadowColor: color,
            shadowOffset: { width: offsetX, height: offsetY },
            shadowOpacity: opacity,
            shadowRadius: radius,
            elevation,
        },
    }) as ViewStyle;
};

// 자주 사용하는 그림자 프리셋
export const shadowPresets = {
    small: createShadow('#000', 0, 1, 0.05, 2, 2),
    medium: createShadow('#000', 0, 2, 0.1, 4, 3),
    large: createShadow('#000', 0, 4, 0.15, 8, 5),
    card: createShadow('#4A4A4A', 0, 5, 0.08, 15, 5),
    button: createShadow('#000', 0, 2, 0.1, 4, 3),
    tooltip: createShadow('#000', 0, 2, 0.25, 4, 5),
};