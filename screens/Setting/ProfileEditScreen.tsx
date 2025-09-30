import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { TextInput } from '@/components/shared/ui/TextInput';
import { Button } from '@/components/shared/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { showAlert, showConfirm } from '@/utils/alert';

const ProfileEditScreen: React.FC = () => {
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phoneNumber || '');
    }
  }, [user]);

  const formatPhoneNumber = (text: string) => {
    const numbers = text.replace(/[^\d]/g, '');
    if (numbers.length > 11) {
      return phone;
    }
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const handlePhotoChange = async () => {
    if (Platform.OS === 'web') {
      showAlert('알림', '웹에서는 프로필 사진 변경이 지원되지 않습니다.');
      return;
    }

    showConfirm(
        '프로필 사진 변경',
        '사진을 어떻게 변경하시겠습니까?',
        openGallery,
        '갤러리',
        '취소'
    );
  };

  const openCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        showAlert('알림', '카메라 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      showAlert('오류', '카메라를 열 수 없습니다.');
    }
  };

  const openGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        showAlert('알림', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      showAlert('오류', '갤러리를 열 수 없습니다.');
    }
  };

  const handlePasswordChange = () => {
    router.push('/(tabs)/settings/password-change');
  };

  const handleSaveChanges = () => {
    // TODO: API 연동하여 프로필 업데이트
    showAlert('알림', '변경사항이 저장되었습니다.', () => router.back());
  };

  const handleAccountDeletion = () => {
    router.push('/(tabs)/settings/account-deletion');
  };

  return (
      <SafeAreaView style={styles.container}>
        <SettingsHeader title="프로필 편집" />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 프로필 사진 섹션 */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              <View style={styles.profileImageContainer}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <Ionicons name="person" size={50} color="#999" />
                )}
              </View>
              <TouchableOpacity style={styles.cameraButton} onPress={handlePhotoChange}>
                <Ionicons name="camera" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.photoText}>프로필 사진 변경</Text>
          </View>

          {/* 입력 필드들 */}
          <View style={styles.inputSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>이름</Text>
              <TextInput
                  variant="styled"
                  value={name}
                  onChangeText={setName}
                  placeholder="이름을 입력하세요"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>이메일</Text>
              <TextInput
                  variant="styled"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="이메일을 입력하세요"
                  keyboardType="email-address"
                  autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>전화번호</Text>
              <TextInput
                  variant="styled"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  placeholder="010-0000-0000"
                  keyboardType="number-pad"
                  maxLength={13}
              />
            </View>
          </View>

          {/* 추가 메뉴들 */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={handlePasswordChange}>
              <Text style={styles.menuText}>비밀번호 변경</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* 변경사항 저장 버튼 */}
          <View style={styles.buttonContainer}>
            <Button
                title="변경사항 저장"
                onPress={handleSaveChanges}
            />
          </View>

          {/* 회원탈퇴 버튼 */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleAccountDeletion}>
            <Text style={styles.deleteButtonText}>회원탈퇴</Text>
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
  scrollView: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
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
  menuSection: {
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
});

export default ProfileEditScreen;