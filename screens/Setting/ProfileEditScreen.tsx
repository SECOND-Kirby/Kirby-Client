// src/screens/setting/ProfileEditScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
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

const ProfileEditScreen: React.FC = () => {
  const [name, setName] = useState('김테니스');
  const [email, setEmail] = useState('tennis@email.com');
  const [phone, setPhone] = useState('010-1234-5678');
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
    Alert.alert(
        '프로필 사진 변경',
        '사진을 어떻게 변경하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '카메라',
            onPress: openCamera,
          },
          {
            text: '갤러리',
            onPress: openGallery,
          },
        ]
    );
  };

  const openCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('알림', '카메라 접근 권한이 필요합니다.');
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
      Alert.alert('오류', '카메라를 열 수 없습니다.');
    }
  };

  const openGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('알림', '갤러리 접근 권한이 필요합니다.');
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
      Alert.alert('오류', '갤러리를 열 수 없습니다.');
    }
  };

  const handlePasswordChange = () => {
    router.push('/password-change');
  };

  const handleSaveChanges = () => {
    Alert.alert('알림', '변경사항이 저장되었습니다.', [
      {
        text: '확인',
        onPress: () => router.back(),
      },
    ]);
  };

  const handleAccountDeletion = () => {
    router.push('/account-deletion');
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
                  value={name}
                  onChangeText={setName}
                  placeholder="이름을 입력하세요"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>이메일</Text>
              <TextInput
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
                variant="secondary"
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