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

interface AccountDeletionScreenProps {}

const AccountDeletionScreen: React.FC<AccountDeletionScreenProps> = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleAccountDeletion = () => {
    if (!currentPassword.trim()) {
      Alert.alert('알림', '현재 비밀번호를 입력해주세요.');
      return;
    }

    if (!isAgreed) {
      Alert.alert('알림', '탈퇴 동의 사항을 확인해주세요.');
      return;
    }

    Alert.alert(
      '회원 탈퇴',
      '정말 회원 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: () => {
            Alert.alert('알림', '회원 탈퇴가 완료되었습니다.', [
              {
                text: '확인',
                onPress: () => router.replace('/'),
              },
            ]);
          },
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
        <Text style={styles.headerTitle}>회원탈퇴</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 경고 메시지 */}
        <View style={styles.warningContainer}>
          <View style={styles.warningIconContainer}>
            <Ionicons name="warning" size={20} color="#D1524C" />
          </View>
          <Text style={styles.warningText}>
            회원 탈퇴 시 모든 데이터가 삭제되며 복구가 불가능합니다
          </Text>
        </View>

        {/* 탈퇴 시 주의사항 */}
        <View style={styles.noticeSection}>
          <Text style={styles.noticeTitle}>탈퇴 시 주의사항</Text>
          
          <View style={styles.noticeItem}>
            <View style={styles.bullet} />
            <Text style={styles.noticeText}>계정 정보 및 개인 데이터가 모두 삭제됩니다</Text>
          </View>
          
          <View style={styles.noticeItem}>
            <View style={styles.bullet} />
            <Text style={styles.noticeText}>현재 이용 중인 서비스가 즉시 중단됩니다</Text>
          </View>
          
          
        </View>

        {/* 비밀번호 입력 */}
        <View style={styles.passwordSection}>
          <Text style={styles.passwordTitle}>현재 비밀번호를 입력해주세요</Text>
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="현재비밀번호"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              textContentType="none"
              autoComplete="off"
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
        </View>

        {/* 동의 체크박스 */}
        <View style={styles.agreementSection}>
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setIsAgreed(!isAgreed)}
          >
            <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]}>
              {isAgreed && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.agreementText}>
              위 내용을 모두 확인하였으며, 회원 탈퇴에 동의합니다
            </Text>
          </TouchableOpacity>
        </View>

        {/* 회원 탈퇴 버튼 */}
        <TouchableOpacity 
          style={[styles.deleteButton, (!currentPassword.trim() || !isAgreed) && styles.deleteButtonDisabled]} 
          onPress={handleAccountDeletion}
          disabled={!currentPassword.trim() || !isAgreed}
        >
          <Text style={[styles.deleteButtonText, (!currentPassword.trim() || !isAgreed) && styles.deleteButtonTextDisabled]}>
            회원 탈퇴
          </Text>
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
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    margin: 20,
  },
  warningIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#D1524C',
    lineHeight: 20,
  },
  noticeSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
    marginTop: 8,
    marginRight: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  passwordSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
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
    top: '50%',
    transform: [{ translateY: -15 }],
    padding: 5,
  },
  agreementSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#D1524C',
    borderColor: '#D1524C',
  },
  agreementText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: '#D1524C',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
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
  deleteButtonDisabled: {
    backgroundColor: '#e0e0e0',
    shadowOpacity: 0,
    elevation: 0,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  deleteButtonTextDisabled: {
    color: '#999',
  },
});

export default AccountDeletionScreen;