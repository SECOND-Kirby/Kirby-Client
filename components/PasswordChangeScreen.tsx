import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface PasswordChangeScreenProps {}

// PasswordInput 컴포넌트를 외부로 분리
const PasswordInput = ({ 
  label, 
  value, 
  onChangeText, 
  showPassword, 
  onToggleShow,
  placeholder,
  onSubmitEditing,
  returnKeyType = "next",
  inputRef
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  showPassword: boolean;
  onToggleShow: () => void;
  placeholder: string;
  onSubmitEditing?: () => void;
  returnKeyType?: "next" | "done";
  inputRef?: React.RefObject<TextInput>;
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.passwordContainer}>
      <TextInput
        ref={inputRef}
        style={styles.passwordInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        underlineColorAndroid="transparent"
        textContentType="none"
        autoComplete="off"
      />
      <TouchableOpacity style={styles.eyeButton} onPress={onToggleShow}>
        <Ionicons
          name={showPassword ? "eye" : "eye-off"}
          size={20}
          color="#999"
        />
      </TouchableOpacity>
    </View>
  </View>
);

const PasswordChangeScreen: React.FC<PasswordChangeScreenProps> = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // TextInput 참조 생성
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleBack = () => {
    router.back();
  };

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
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>비밀번호변경</Text>
        <View style={styles.placeholder} />
      </View>

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
          {/* 입력 필드들 */}
          <View style={styles.inputSection}>
            <PasswordInput
              label="현재 비밀번호"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              showPassword={showCurrentPassword}
              onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
              placeholder="현재 비밀번호 입력"
              onSubmitEditing={() => newPasswordRef.current?.focus()}
            />

            <PasswordInput
              label="새 비밀번호"
              value={newPassword}
              onChangeText={setNewPassword}
              showPassword={showNewPassword}
              onToggleShow={() => setShowNewPassword(!showNewPassword)}
              placeholder="새 비밀번호 입력"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              inputRef={newPasswordRef}
            />

            <PasswordInput
              label="새 비밀번호 확인"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              showPassword={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="새 비밀번호 다시 입력"
              onSubmitEditing={handlePasswordChange}
              returnKeyType="done"
              inputRef={confirmPasswordRef}
            />
          </View>

          {/* 비밀번호 조건 안내 */}
          <View style={styles.rulesSection}>
            <Text style={styles.rulesTitle}>비밀번호규칙</Text>
            <Text style={styles.ruleItem}>• 8자 이상입력</Text>
            <Text style={styles.ruleItem}>• 영문, 숫자, 특수문자 2가지 이상 조합</Text>
            <Text style={styles.ruleItem}>• 이전 비밀번호와 동일할 수 없음</Text>
          </View>

          {/* 비밀번호 변경 버튼 */}
          <TouchableOpacity style={styles.changeButton} onPress={handlePasswordChange}>
            <Text style={styles.changeButtonText}>비밀번호 변경</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
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
    color: '#333',
    marginBottom: 8,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: '40%',
    transform: [{ translateY: -10 }],
    padding: 5,
  },
  rulesSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  ruleItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  changeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default PasswordChangeScreen;