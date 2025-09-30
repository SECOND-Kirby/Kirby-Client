import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Colors } from '@/constants/Colors';
import { SPACING } from '@/utils/constants';

const SignUpScreen = () => {
    const HeaderComponent = (
        <View style={styles.headerContainer}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
            >
                <Ionicons name="chevron-back" size={24} color={Colors.text.main} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>회원가입</Text>
            <View style={styles.placeholder} />
        </View>
    );

    return (
        <AuthLayout headerComponent={HeaderComponent}>
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
        marginBottom: SPACING.lg,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.main,
    },
    placeholder: {
        width: 40,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: SPACING.xl,
        textAlign: 'center',
    },
});

export default SignUpScreen;