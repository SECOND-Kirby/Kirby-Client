import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Colors } from '@/constants/Colors';
import { SPACING } from '@/utils/constants';

const SignUpScreen = () => {
    const HeaderComponent = (
        <View>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace('/(auth)')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.text.main} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>회원가입</Text>
                <View style={styles.placeholder} />
            </View>
            <View style={styles.divider} />
        </View>
    );

    return (
        <AuthLayout headerComponent={HeaderComponent} variant="signup">
            <Text style={styles.welcomeText}>환영합니다</Text>
            <Text style={styles.subtitle}>
                회원가입을 위해 정보를 입력해주세요
            </Text>
            <SignUpForm />
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    backButton: {
        padding: 5,
        marginLeft: -16,
        marginTop: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.main,
    },
    placeholder: {
        width: 40,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        width: '110%',
        alignSelf: 'center',
        marginBottom: SPACING.lg,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.main,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: SPACING.xl,
    },
});

export default SignUpScreen;