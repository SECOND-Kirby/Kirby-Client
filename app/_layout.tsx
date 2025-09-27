import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Stack screenOptions={{ headerShown: false }}>

                    {/* 1. index: 로그인 상태를 체크하고 라우팅을 분기하는 '인증 게이트' 파일입니다. */}
                    <Stack.Screen name="index" />

                    {/* 2. (auth): 로그인/회원가입 그룹 (하단 탭 바 없음) */}
                    <Stack.Screen name="(auth)" />

                    {/* 3. (tabs): 메인 앱 그룹 (하단 탭 바 있음) */}
                    <Stack.Screen name="(tabs)" />

                    {/* 4. +not-found: 404 페이지 */}
                    <Stack.Screen name="+not-found" />

                </Stack>
                <StatusBar style="auto" />
            </KeyboardAvoidingView>
        </ThemeProvider>
    );
}