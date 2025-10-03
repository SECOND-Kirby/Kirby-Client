// src/screens/setting/SettingScreen.tsx
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { showAlert, showConfirm } from '@/utils/alert';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { SectionHeader } from '@/components/settings/SectionHeader';
import { SettingItem } from '@/components/settings/SettingItem';

const SettingsScreen = () => {
    const { user, logout } = useAuthStore();
    const {
        dailyGoalHours,
        serveGoal,
        soundEnabled,
        notificationEnabled,
        setSoundEnabled,
        setNotificationEnabled,
        resetSettings,
    } = useSettingsStore();

    const handleProfileEdit = () => {
        router.push('/(tabs)/settings/profile-edit');
    };

    const handleGoalEdit = (type: 'time' | 'serve') => {
        if (type === 'time') {
            router.push('/(tabs)/settings/daily-goal-setting');
        } else {
            router.push('/(tabs)/settings/serve-goal-setting');
        }
    };

    const handleLanguageSetting = () => {
        showAlert('언어설정', '현재 한국어로 설정되어 있습니다.');
    };

    const handleDataReset = () => {
        showConfirm(
            '데이터 초기화',
            '모든 데이터가 삭제됩니다. 계속하시겠습니까?',
            () => {
                resetSettings();
                showAlert('알림', '데이터가 초기화되었습니다.');
            },
            '초기화',
            '취소',
            true
        );
    };

    const handleLogout = async () => {
        showConfirm(
            '로그아웃',
            '정말 로그아웃하시겠습니까?',
            async () => {
                await logout();
                router.replace('/(auth)');
            },
            '로그아웃',
            '취소',
            true
        );
    };

    const handleAccountDeletion = () => {
        router.push('/(tabs)/settings/account-deletion');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>설정</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <ProfileSection
                    user={user}
                    onEditPress={handleProfileEdit}
                    cardBackgroundColor={Colors.background.card}
                    primaryLightColor={Colors.primary}
                />

                <SectionHeader title="목표" />
                <View style={styles.section}>
                    <SettingItem
                        icon="time-outline"
                        title="일일 운동 시간"
                        value={`${dailyGoalHours}시간`}
                        onPress={() => handleGoalEdit('time')}
                        iconColor={Colors.primary}
                    />
                    <SettingItem
                        icon="golf-outline"
                        title="서브 횟수 목표"
                        value={`${serveGoal}회`}
                        onPress={() => handleGoalEdit('serve')}
                        iconColor={Colors.primary}
                    />
                </View>

                <SectionHeader title="앱 설정" />
                <View style={styles.section}>
                    <SettingItem
                        icon="globe-outline"
                        title="언어설정"
                        value="한국어"
                        onPress={handleLanguageSetting}
                        iconColor={Colors.primary}
                    />
                    <SettingItem
                        icon="volume-high-outline"
                        title="소리설정"
                        hasToggle={true}
                        toggleValue={soundEnabled}
                        onToggleChange={setSoundEnabled}
                        showArrow={false}
                        iconColor={Colors.primary}
                    />
                    <SettingItem
                        icon="notifications-outline"
                        title="알림설정"
                        hasToggle={true}
                        toggleValue={notificationEnabled}
                        onToggleChange={setNotificationEnabled}
                        showArrow={false}
                        iconColor={Colors.primary}
                    />
                    <SettingItem
                        icon="trash-outline"
                        title="데이터 초기화"
                        onPress={handleDataReset}
                        showArrow={false}
                        iconColor={Colors.error}
                    />
                </View>

                <SectionHeader title="계정관리" />
                <View style={styles.section}>
                    <SettingItem
                        icon="log-out-outline"
                        title="로그아웃"
                        onPress={handleLogout}
                        showArrow={false}
                        iconColor={Colors.error}
                    />
                    <SettingItem
                        icon="person-remove-outline"
                        title="회원 탈퇴"
                        onPress={handleAccountDeletion}
                        showArrow={false}
                        iconColor={Colors.error}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    header: {
        backgroundColor: Colors.background.main,
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 50,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text.main,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        backgroundColor: Colors.background.card,
        marginBottom: 20,
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
});

export default SettingsScreen;