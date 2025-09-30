import React, { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';

import { ThemedView } from '@/components/shared/ui/ThemedView';
import { Colors } from '@/constants/Colors';

interface AuthLayoutProps extends PropsWithChildren {
    headerComponent: React.ReactNode;
}

export function AuthLayout({ children, headerComponent }: AuthLayoutProps) {
    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* 헤더 영역 */}
                        <View style={styles.header}>{headerComponent}</View>

                        {/* 폼 영역 */}
                        <View style={styles.formContainer}>{children}</View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.card,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        width: '100%',
    },
    formContainer: {
        width: '100%',
        flex: 1,
    },
});