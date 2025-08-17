import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    // 8자 이상
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }

    // 영문, 숫자, 특수문자 중 최소 2개 이상 포함
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const categories = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (categories < 2) {
      return '영문(대/소문자), 숫자, 특수문자 중 최소 2개 이상 포함해야 합니다.';
    }

    return null; // 검증 통과
  };

  const handleBack = () => {
    router.back();
  };

  const validateId = (id) => {
    // 6자 이상
    if (id.length < 6) {
      return '아이디는 6자 이상이어야 합니다.';
    }
    
    // 영문과 숫자만 허용
    const idRegex = /^[a-zA-Z0-9]+$/;
    if (!idRegex.test(id)) {
      return '아이디는 영문과 숫자만 사용할 수 있습니다.';
    }
    
    return null; // 검증 통과
  };

  const handleDuplicateCheck = () => {
    if (id.trim() === '') {
      Alert.alert('알림', '아이디를 입력해주세요.');
      return;
    }
    
    const idError = validateId(id);
    if (idError) {
      Alert.alert('알림', '형식이 알맞지 않습니다.\n' + idError);
      return;
    }
    
    // 실제 앱에서는 서버에 중복 확인 요청
    Alert.alert('알림', '사용 가능한 아이디입니다.');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (text) => {
    // 숫자만 추출
    const numbers = text.replace(/[^\d]/g, '');
    
    // 11자리 초과 시 자르기
    if (numbers.length > 11) {
      return phone;
    }
    
    // 형식에 맞게 변환
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };
  const handleSignUp = () => {
    // 입력 검증
    if (!name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('알림', '올바른 이메일 주소를 입력해주세요.');
      return;
    }
    if (!phone.trim() || !validatePhone(phone)) {
      Alert.alert('알림', '전화번호를 010-0000-0000 형식으로 입력해주세요.');
      return;
    }
    if (!id.trim()) {
      Alert.alert('알림', '아이디를 입력해주세요.');
      return;
    }
    
    const idError = validateId(id);
    if (idError) {
      Alert.alert('알림', idError);
      return;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert('알림', passwordError);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    // 회원가입 성공 시
    Alert.alert(
      '회원가입 완료',
      '회원가입이 완료되었습니다. 로그인해주세요.',
      [
        {
          text: '확인',
          onPress: () => router.replace('/'),
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
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* 환영 메시지 */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>환영합니다</Text>
          <Text style={styles.welcomeSubtitle}>회원가입을 위해 정보를 입력해주세요</Text>
        </View>

        {/* 입력 필드들 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력해주세요"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.inputLabel}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.inputLabel}>전화번호</Text>
          <TextInput
            style={styles.input}
            placeholder="010-0000-0000"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="number-pad"
            maxLength={13}
          />

          <Text style={styles.inputLabel}>아이디</Text>
          <View style={styles.idContainer}>
            <TextInput
              style={[styles.input, styles.idInput]}
              placeholder="6자 이상의 영문/숫자 조합"
              placeholderTextColor="#999"
              value={id}
              onChangeText={setId}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.duplicateButton} onPress={handleDuplicateCheck}>
              <Text style={styles.duplicateButtonText}>중복확인</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>비밀번호</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="비밀번호를 입력해주세요"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.passwordHint}>
            비밀번호는 8자 이상이어야 합니다.{'\n'}
            영문(대/소문자), 숫자, 특수문자 중 최소 2개 이상 포함해야 합니다.
          </Text>

          <Text style={styles.inputLabel}>비밀번호확인</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="비밀번호를 다시 입력해주세요"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 회원가입 버튼 */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>회원가입</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    width: 34, // backButton과 같은 너비
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  welcomeContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    paddingHorizontal: 30,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idInput: {
    flex: 1,
    marginRight: 10,
  },
  duplicateButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  duplicateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: '35%',
    transform: [{ translateY: -10 }],
    padding: 5,
  },
  passwordHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    lineHeight: 16,
  },
  signUpButton: {
    backgroundColor: '#E7FF65',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 30,
    marginVertical: 30,
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
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SignUpScreen;