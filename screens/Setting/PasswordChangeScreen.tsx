// src/screens/setting/PasswordChangeScreen.tsx
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Button } from '@/components/shared/ui/Button';
import { PasswordInput } from '@/components/shared/ui/PasswordInput';

const PasswordChangeScreen: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const categories = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (categories < 2) {
      return '영문(대/소문자), 숫자, 특수문자 중 최소 2개 이상 포함해야 합니다.';
    }

    return null;
  };

  const handlePasswordChange = () => {
    if (!currentPassword.trim()) {
      Alert.alert('알림', '현재 비밀번호를 입력해주세요.');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      Alert.alert('알림', passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('알림', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('알림', '현재 비밀번호와 새 비밀번호가 같습니다.');
      return;
    }

    Alert.alert(
        '비밀번호 변경',
        '비밀번호가 성공적으로 변경되었습니다.',
        [
          {
            text: '확인',
            onPress: () => router.back(),
          },
        ]
    );
  };

  return (
      <SafeAreaView style={styles.container}>
        <SettingsHeader title="비밀번호변경" />

        <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.inputSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>현재 비밀번호</Text>
                <PasswordInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="현재 비밀번호 입력"
                    returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>새 비밀번호</Text>
                <PasswordInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="새 비밀번호 입력"
                    returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>새 비밀번호 확인</Text>
                <PasswordInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="새 비밀번호 재입력"
                    returnKeyType="done"
                    onSubmitEditing={handlePasswordChange}
                />
              </View>
            </View>

            <View style={styles.rulesSection}>
              <Text style={styles.rulesTitle}>비밀번호 규칙</Text>
              <Text style={styles.ruleItem}> •  8자 이상 입력</Text>
              <Text style={styles.ruleItem}> •  영문, 숫자, 특수문자 2가지 이상 조합</Text>
              <Text style={styles.ruleItem}> •  이전 비밀번호와 동일할 수 없음</Text>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                  variant="info"
                  title="비밀번호 변경"
                  onPress={handlePasswordChange}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.card,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.main,
    marginBottom: 8,
  },
  rulesSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.password.ruleBackground,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.main,
    marginBottom: 12,
  },
  ruleItem: {
    fontSize: 14,
    color: Colors.text.ruleItem,
    lineHeight: 20,
    marginBottom: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 40,
  },
});

export default PasswordChangeScreen;