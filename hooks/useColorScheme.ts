import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme, Platform } from 'react-native';

/**
 * 웹에서는 SSR 지원을 위해 hydration 후 color scheme 반환
 * 네이티브에서는 바로 color scheme 반환
 */
export function useColorScheme() {
    const colorScheme = useRNColorScheme();

    // 웹이 아니면 바로 반환
    if (Platform.OS !== 'web') {
        return colorScheme;
    }

    // 웹에서는 hydration 체크
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    if (hasHydrated) {
        return colorScheme;
    }

    return 'light';
}