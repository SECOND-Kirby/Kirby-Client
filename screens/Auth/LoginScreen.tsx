import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { Colors } from '@/constants/Colors';
import { SPACING } from '@/utils/constants';

const LoginScreen = () => {
    const HeaderComponent = (
        <View style={styles.headerContent}>
            <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.appName}>테니스봇</Text>
            <Text style={styles.appSubtitle}>RallyWalk</Text>
        </View>
    );

    return (
        <AuthLayout headerComponent={HeaderComponent} variant="login">
            <LoginForm />
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    headerContent: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: SPACING.lg,
    },
    appName: {
        fontSize: 25,
        fontWeight: '600',
        color: Colors.text.main,
        marginBottom: 4,
    },
    appSubtitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text.main,
    },
});

export default LoginScreen;