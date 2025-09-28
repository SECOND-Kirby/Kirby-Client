// src/components/auth/AuthLayout.tsx
import React, { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/shared/ui/ThemedView';

interface AuthLayoutProps extends PropsWithChildren {
    headerComponent: React.ReactNode;
}

export function AuthLayout({ children, headerComponent }: AuthLayoutProps) {
    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps="handled">
                    {/* 로고 및 제목 영역 */}
                    <View style={styles.header}>{headerComponent}</View>

                    {/* 폼 및 내용 영역 */}
                    <View style={styles.formContainer}>{children}</View>
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingTop: 80, // 상단 로고/헤더 공간 확보
        paddingBottom: 50, // 하단 버튼 공간 확보
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    formContainer: {
        width: '100%',
    },
});