// screens/Main/TrainingScreen.tsx
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { useTrainingSettings } from '@/hooks';
import TrainingModeSelector from '@/components/training/TrainingModeSelector';
import SettingsCard from '@/components/training/SettingsCard';
import StatsCard from '@/components/shared/ui/StatsCard';
import { shadowPresets } from '@/utils/styles';

const TrainingScreen: React.FC = () => {
    const { user } = useAuthStore();

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

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>오늘의 훈련</Text>
                    <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
                        <Ionicons name="person-outline" size={24} color={Colors.text.secondary}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.greetingSection}>
                    <Text style={styles.greeting}>
                        안녕하세요, {user?.name || '사용자'}님
                    </Text>
                </View>

                <View style={styles.statsSection}>
                    <StatsCard
                        icon={require('@/assets/images/clock.png')}
                        value="1시간30분"
                        label="훈련 시간"
                    />
                    <StatsCard
                        icon={require('@/assets/images/serve.png')}
                        value="56회"
                        label="서브 횟수"
                    />
                    <StatsCard
                        icon={require('@/assets/images/battery.png')}
                        value="85%"
                        label="배터리"
                    />
                </View>

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

                <TouchableOpacity
                    style={styles.startButton}
                    onPress={handleStartTraining}
                >
                    <Text style={styles.startButtonText}>훈련 시작</Text>
                </TouchableOpacity>

                <TrainingModeSelector
                    selectedMode={settings.mode}
                    onModeSelect={updateMode}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: Colors.background.main,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text.main,
    },
    profileIcon: {
        padding: 8
    },
    scrollView: {
        flex: 1
    },
    greetingSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    greeting: {
        fontSize: 16,
        color: Colors.text.secondary,
    },
    statsSection: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
        gap: 8,
    },
    startButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginVertical: 20,
        alignItems: 'center',
        ...shadowPresets.button,
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.main,
    },
});

export default TrainingScreen;