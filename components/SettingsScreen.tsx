import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface SettingItemProps {
  icon: string | ImageSourcePropType;
  title: string;
  value?: string;
  onPress?: () => void;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  showArrow?: boolean;
  iconColor?: string;
  iconType?: 'ionicon' | 'image';
}

interface SectionHeaderProps {
  title: string;
}

const SettingsScreen = () => {
  const params = useLocalSearchParams();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [dailyGoalHours, setDailyGoalHours] = useState(24);
  const [serveGoal, setServeGoal] = useState(50);

  // 화면이 포커스될 때마다 파라미터 확인
  useFocusEffect(
    useCallback(() => {
      if (params.updatedDailyGoalHours) {
        const hours = parseInt(params.updatedDailyGoalHours as string);
        setDailyGoalHours(hours);
        Alert.alert('알림', '목표가 저장되었습니다.');
        router.replace('/(tabs)/settings');
      }
      if (params.updatedServeGoal) {
        const serves = parseInt(params.updatedServeGoal as string);
        setServeGoal(serves);
        Alert.alert('알림', '목표가 저장되었습니다.');
        router.replace('/(tabs)/settings');
      }
    }, [params.updatedDailyGoalHours, params.updatedServeGoal])
  );

  const handleProfileEdit = () => {
    router.push('/profile-edit');
  };

  const handleGoalEdit = (type: 'time' | 'serve') => {
    router.push({
      pathname: '/goal-setting',
      params: {
        type: type,
        dailyGoalHours: dailyGoalHours.toString(),
        serveGoal: serveGoal.toString()
      }
    });
  };

  const handleLanguageSetting = () => {
    Alert.alert('언어설정', '현재 한국어로 설정되어 있습니다.');
  };

  const handleDataReset = () => {
    Alert.alert(
      '데이터 초기화',
      '모든 데이터가 삭제됩니다. 계속하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '초기화',
          style: 'destructive',
          onPress: () => {
            setSoundEnabled(true);
            setNotificationEnabled(true);
            setDailyGoalHours(24);
            setServeGoal(50);
            Alert.alert('알림', '데이터가 초기화되었습니다.');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleAccountDeletion = () => {
    router.push('/account-deletion');  // account-deletion.tsx로 이동
  };

  const SettingItem: React.FC<SettingItemProps> = (props) => {
    const {
      icon,
      title,
      value,
      onPress,
      hasToggle = false,
      toggleValue = false,
      onToggleChange = () => {},
      showArrow = true,
      iconColor = "#666",
      iconType = "ionicon"
    } = props;

    return (
      <TouchableOpacity 
        style={styles.settingItem} 
        onPress={onPress} 
        disabled={hasToggle}
      >
        <View style={styles.settingLeft}>
          {iconType === "image" ? (
            <Image 
              source={icon as ImageSourcePropType} 
              style={[styles.settingIconImage, { tintColor: iconColor }]} 
              resizeMode="contain"
            />
          ) : (
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={iconColor} 
              style={styles.settingIcon} 
            />
          )}
          <Text style={styles.settingTitle}>{title}</Text>
        </View>
        <View style={styles.settingRight}>
          {hasToggle ? (
            <View style={styles.customToggle}>
              <TouchableOpacity
                style={[
                  styles.toggleContainer,
                  toggleValue ? styles.toggleActive : styles.toggleInactive,
                ]}
                onPress={() => onToggleChange(!toggleValue)}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    toggleValue ? styles.thumbActive : styles.thumbInactive,
                  ]}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {value && <Text style={styles.settingValue}>{value}</Text>}
              {showArrow && <Ionicons name="chevron-forward" size={16} color="#ccc" />}
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
    const { title } = props;
    return <Text style={styles.sectionHeader}>{title}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.profileImageContainer}>
              <Ionicons name="person" size={30} color="#999" />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>김테니스</Text>
              <Text style={styles.profileEmail}>tennis@email.com</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleProfileEdit}>
            <Text style={styles.editButtonText}>프로필 편집</Text>
          </TouchableOpacity>
        </View>

        <SectionHeader title="목표" />
        <View style={styles.section}>
          <SettingItem
            icon={require('@/assets/images/clock-icon.png')}
            iconType="image"
            title="일일 운동 시간"
            value={`${dailyGoalHours}시간`}
            onPress={() => handleGoalEdit('time')}
            iconColor="#B2C549"
          />
          <SettingItem
            icon={require('@/assets/images/material-symbols_target.png')}
            iconType="image"
            title="서브 횟수 목표"
            value={`${serveGoal}회`}
            onPress={() => handleGoalEdit('serve')}
            iconColor="#B2C549"
          />
        </View>

        <SectionHeader title="앱 설정" />
        <View style={styles.section}>
          <SettingItem
            icon={require('@/assets/images/globe-icon.png')}
            iconType="image"
            title="언어설정"
            value="한국어"
            onPress={handleLanguageSetting}
            iconColor="#B2C549"
          />
          <SettingItem
            icon={require('@/assets/images/sound-icon.png')}
            iconType="image"
            title="소리설정"
            hasToggle={true}
            toggleValue={soundEnabled}
            onToggleChange={setSoundEnabled}
            showArrow={false}
            iconColor="#B2C549"
          />
          <SettingItem
            icon={require('@/assets/images/notification-icon.png')}
            iconType="image"
            title="알림설정"
            hasToggle={true}
            toggleValue={notificationEnabled}
            onToggleChange={setNotificationEnabled}
            showArrow={false}
            iconColor="#B2C549"
          />
          <SettingItem
            icon={require('@/assets/images/trash-icon.png')}
            iconType="image"
            title="데이터 초기화"
            onPress={handleDataReset}
            showArrow={false}
            iconColor="#D1524C"
          />
        </View>

        <SectionHeader title="계정관리" />
        <View style={styles.section}>
          <SettingItem
            icon={require('@/assets/images/logout-icon.png')}
            iconType="image"
            title="로그아웃"
            onPress={handleLogout}
            showArrow={false}
            iconColor="#D1524C"
          />
          <SettingItem
            icon={require('@/assets/images/delete-user-icon.png')}
            iconType="image"
            title="회원 탈퇴"
            onPress={handleAccountDeletion}
            showArrow={false}
            iconColor="#D1524C"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#E7FF65',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 8,
    marginTop: 20,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingIconImage: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  customToggle: {
    alignItems: 'center',
  },
  toggleContainer: {
    width: 40,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleActive: {
    backgroundColor: '#B2C549',
  },
  toggleInactive: {
    backgroundColor: '#e0e0e0',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  thumbActive: {
    right: 2,
  },
  thumbInactive: {
    left: 2,
  },
});

export default SettingsScreen;