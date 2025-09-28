// src/screens/Auth/SignUpScreen.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AuthLayout } from '@/components/auth/AuthLayout'; // 공통 레이아웃
import { SignUpForm } from '@/components/auth/SignUpForm'; // 분리된 폼 컴포넌트

const SignUpScreen = () => {
    // 스크린의 역할: 헤더 정의 및 폼 컴포넌트 조합
    const HeaderComponent = (
        <View style={styles.headerContent}>
            <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.appName}>회원가입</Text>
            <Text style={styles.subtitle}>간단한 정보를 입력하고 시작하세요.</Text>
        </View>
    );

    return (
        // AuthLayout으로 화면 전체를 감싸고, 중앙 영역에 SignUpForm을 배치
        <AuthLayout headerComponent={HeaderComponent}>
            <SignUpForm />
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    headerContent: {
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});

export default SignUpScreen;