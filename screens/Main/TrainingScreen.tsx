import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import React from 'react';
import {
    Image, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTrainingSettings } from '@/hooks/useTrainingSettings';
import TrainingModeSelector from '@/components/training/TrainingModeSelector';
import SettingsCard from '@/components/training/SettingsCard';

const TrainingScreen: React.FC = () => {
    const backgroundColor = useThemeColor({}, 'background');
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');
    const primaryLightColor = useThemeColor({}, 'primaryLight');

    const {
        settings,
        updateMode,
        updateIntensity,
        updateDirection,
        updateFrequency,
        adjustDuration,
    } = useTrainingSettings();

    const handleProfilePress = () => {
        router.push('/(tabs)/settings');
    };

    const handleStartTraining = () => {
        router.push({
            pathname: '/training/session' as any,
            params: {
                duration: settings.duration.toString(),
                mode: settings.mode,
                intensity: settings.intensity.toString(),
                direction: settings.direction.toString(),
                frequency: settings.frequency.toString(),
            }
        });
    };

    const statsData = [
        {
            icon: require('@/assets/images/clock.png'),
            value: '1시간30분',
            label: '훈련 시간'
        },
        {
            icon: require('@/assets/images/serve.png'),
            value: '56회',
            label: '서브 횟수'
        },
        {
            icon: require('@/assets/images/battery.png'),
            value: '85%',
            label: '배터리'
        }
    ];

    return (
        <View style={[styles.container, {backgroundColor}]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* 헤더 */}
                <View style={[styles.header, {backgroundColor}]}>
                    <Text style={styles.headerTitle}>오늘의 훈련</Text>
                    <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
                        <Ionicons name="person-outline" size={24} color="#666"/>
                    </TouchableOpacity>
                </View>

                {/* 인사말 */}
                <View style={styles.greetingSection}>
                    <Text style={styles.greeting}>안녕하세요, 김테니스님</Text>
                </View>

                {/* 상단 통계 카드들 */}
                <View style={styles.statsSection}>
                    {statsData.map((stat, index) => (
                        <View key={index} style={[styles.statCard, {backgroundColor: cardBackgroundColor}]}>
                            <Image source={stat.icon} style={styles.statIcon}/>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* 훈련 설정 카드 - 기존 컴포넌트 사용 */}
                <SettingsCard
                    intensity={settings.intensity}
                    direction={settings.direction}
                    frequency={settings.frequency}
                    duration={settings.duration}
                    onIntensityChange={updateIntensity}
                    onDirectionChange={updateDirection}
                    onFrequencyChange={updateFrequency}
                    onDurationChange={adjustDuration}
                />

                {/* 훈련 시작 버튼 */}
                <TouchableOpacity
                    style={[styles.startButton, {backgroundColor: primaryLightColor}]}
                    onPress={handleStartTraining}
                >
                    <Text style={styles.startButtonText}>훈련 시작</Text>
                </TouchableOpacity>

                {/* 훈련 모드 선택 - 기존 컴포넌트 사용 */}
                <TrainingModeSelector
                    selectedMode={settings.mode}
                    onModeSelect={updateMode}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileIcon: { padding: 8 },
    scrollView: { flex: 1 },
    greetingSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    greeting: {
        fontSize: 16,
        color: '#666',
    },
    statsSection: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
        gap: 8,
    },
    statCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statIcon: {
        width: 24,
        height: 24,
        marginBottom: 8,
        resizeMode: 'contain',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    startButton: {
        borderRadius: 12,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginVertical: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default TrainingScreen;