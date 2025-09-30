import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/store/authStore';
import { showAlert, showConfirm } from '@/utils/alert';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { SectionHeader } from '@/components/settings/SectionHeader';
import { SettingItem } from '@/components/settings/SettingItem';

const SettingsScreen = () => {
    const params = useLocalSearchParams();
    const { user, logout } = useAuthStore();
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [notificationEnabled, setNotificationEnabled] = useState(true);
    const [dailyGoalHours, setDailyGoalHours] = useState(2);
    const [serveGoal, setServeGoal] = useState(50);

    const backgroundColor = useThemeColor({}, 'background');
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');
    const primaryColor = useThemeColor({}, 'primary');
    const primaryLightColor = useThemeColor({}, 'primaryLight');
    const redColor = useThemeColor({}, 'red');

    useFocusEffect(
        useCallback(() => {
            if (params.updatedDailyGoalHours) {
                const hours = parseInt(params.updatedDailyGoalHours as string);
                setDailyGoalHours(hours);
                showAlert('알림', '목표가 저장되었습니다.', () => router.replace('/(tabs)/settings'));
            }
            if (params.updatedServeGoal) {
                const serves = parseInt(params.updatedServeGoal as string);
                setServeGoal(serves);
                showAlert('알림', '목표가 저장되었습니다.', () => router.replace('/(tabs)/settings'));
            }
        }, [params.updatedDailyGoalHours, params.updatedServeGoal])
    );

    const handleProfileEdit = () => {
        router.push('/(tabs)/settings/profile-edit');
    };

    const handleGoalEdit = (type: 'time' | 'serve') => {
        router.push({
            pathname: '/(tabs)/settings/goal-setting',
            params: {
                type: type,
                dailyGoalHours: dailyGoalHours.toString(),
                serveGoal: serveGoal.toString()
            }
        });
    };

    const handleLanguageSetting = () => {
        showAlert('언어설정', '현재 한국어로 설정되어 있습니다.');
    };

    const handleDataReset = () => {
        showConfirm(
            '데이터 초기화',
            '모든 데이터가 삭제됩니다. 계속하시겠습니까?',
            () => {
                setSoundEnabled(true);
                setNotificationEnabled(true);
                setDailyGoalHours(2);
                setServeGoal(50);
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
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View style={[styles.header, { backgroundColor }]}>
                <Text style={styles.headerTitle}>설정</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <ProfileSection
                    user={user}
                    onEditPress={handleProfileEdit}
                    cardBackgroundColor={cardBackgroundColor}
                    primaryLightColor={primaryLightColor}
                />

                <SectionHeader title="목표" />
                <View style={[styles.section, { backgroundColor: cardBackgroundColor }]}>
                    <SettingItem
                        icon="time-outline"
                        title="일일 운동 시간"
                        value={`${dailyGoalHours}시간`}
                        onPress={() => handleGoalEdit('time')}
                        iconColor={primaryColor}
                    />
                    <SettingItem
                        icon="golf-outline"
                        title="서브 횟수 목표"
                        value={`${serveGoal}회`}
                        onPress={() => handleGoalEdit('serve')}
                        iconColor={primaryColor}
                    />
                </View>

                <SectionHeader title="앱 설정" />
                <View style={[styles.section, { backgroundColor: cardBackgroundColor }]}>
                    <SettingItem
                        icon="globe-outline"
                        title="언어설정"
                        value="한국어"
                        onPress={handleLanguageSetting}
                        iconColor={primaryColor}
                    />
                    <SettingItem
                        icon="volume-high-outline"
                        title="소리설정"
                        hasToggle={true}
                        toggleValue={soundEnabled}
                        onToggleChange={setSoundEnabled}
                        showArrow={false}
                        iconColor={primaryColor}
                    />
                    <SettingItem
                        icon="notifications-outline"
                        title="알림설정"
                        hasToggle={true}
                        toggleValue={notificationEnabled}
                        onToggleChange={setNotificationEnabled}
                        showArrow={false}
                        iconColor={primaryColor}
                    />
                    <SettingItem
                        icon="trash-outline"
                        title="데이터 초기화"
                        onPress={handleDataReset}
                        showArrow={false}
                        iconColor={redColor}
                    />
                </View>

                <SectionHeader title="계정관리" />
                <View style={[styles.section, { backgroundColor: cardBackgroundColor }]}>
                    <SettingItem
                        icon="log-out-outline"
                        title="로그아웃"
                        onPress={handleLogout}
                        showArrow={false}
                        iconColor={redColor}
                    />
                    <SettingItem
                        icon="person-remove-outline"
                        title="회원 탈퇴"
                        onPress={handleAccountDeletion}
                        showArrow={false}
                        iconColor={redColor}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 50,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollView: {
        flex: 1,
    },
    section: {
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