// src/screens/Auth/LoginScreen.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm'; // 분리된 폼 컴포넌트

const LoginScreen = () => {
  const HeaderComponent = (
      <View style={styles.headerContent}>
        <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
        />
        <Text style={styles.appName}>SwingMaster</Text>
        <Text style={styles.subtitle}>로그인하여 서비스를 이용하세요.</Text>
      </View>
  );

  return (
      <AuthLayout headerComponent={HeaderComponent}>
        <LoginForm />
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

export default LoginScreen;