import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const LoginScreen = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 간단한 로그인 검증 (실제 앱에서는 서버 인증 필요)
    if (id.trim() === '' || password.trim() === '') {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    // 홈 화면(탭 네비게이션)으로 이동
    router.replace('/(tabs)/home');
  };

  const handleSignUp = () => {
    Alert.alert('알림', '회원가입 기능은 준비 중입니다.');
  };

  return (
    <View style={styles.container}>
      {/* 로고 및 앱 이름 */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/tennis-ball-icon.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.appName}>테니스봇 Kirby</Text>
      </View>

      {/* 입력 필드들 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#999"
          value={id}
          onChangeText={setId}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* 회원가입 링크 */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>아직 Kirby 회원이 아니신가요? </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signupLink}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  // Fallback 로고 스타일 (사용하지 않음)
  /*
  logoCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#E7FF65',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tennisBall: {
    width: 50,
    height: 50,
    position: 'relative',
  },
  ballLine1: {
    position: 'absolute',
    top: 10,
    left: 5,
    right: 5,
    height: 2,
    backgroundColor: '#333',
    borderRadius: 1,
    transform: [{ rotate: '20deg' }],
  },
  ballLine2: {
    position: 'absolute',
    bottom: 10,
    left: 5,
    right: 5,
    height: 2,
    backgroundColor: '#333',
    borderRadius: 1,
    transform: [{ rotate: '-20deg' }],
  },
  */
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#E7FF65',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    color: '#B2C549',
    fontWeight: 'bold',
  },
});

export default LoginScreen;