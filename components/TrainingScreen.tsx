import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TrainingMode {
    id: 'serve' | 'ai';
    title: string;
    subtitle: string;
    icon: string;
}

const TrainingScreen: React.FC = () => {
    const [selectedMode, setSelectedMode] = useState<'serve' | 'ai'>('serve');
    const [intensity, setIntensity] = useState(50);
    const [direction, setDirection] = useState(30);
    const [frequency, setFrequency] = useState(40);
    const [duration, setDuration] = useState(60);

    // 테마 색상 가져오기
    const backgroundColor = useThemeColor({}, 'background');
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');
    const primaryColor = useThemeColor({}, 'primary');
    const primaryLightColor = useThemeColor({}, 'primaryLight');

    const trainingModes: TrainingMode[] = [
        {
            id: 'serve',
            title: '서브 훈련',
            subtitle: '속도 및 방향 조절',
            icon: 'search-outline'
        },
        {
            id: 'ai',
            title: 'AI 추천',
            subtitle: '맞춤 훈련 모드',
            icon: 'bulb-outline'
        }
    ];

    const handleModeSelect = (mode: 'serve' | 'ai') => {
        setSelectedMode(mode);
    };

    const adjustDuration = (increase: boolean) => {
        const newDuration = increase ? duration + 5 : duration - 5;
        if (newDuration >= 5 && newDuration <= 120) {
            setDuration(newDuration);
        }
    };

    const handleStartTraining = () => {
        console.log('훈련 시작:', {
            mode: selectedMode,
            intensity,
            direction,
            frequency,
            duration
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {/* 헤더 - 홈과 동일 */}
            <View style={[styles.header, { backgroundColor }]}>
                <Text style={styles.headerTitle}>오늘의 훈련</Text>
                <TouchableOpacity style={styles.profileIcon}>
                    <Ionicons name="person-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* 인사말 */}
                <View style={styles.greetingSection}>
                    <Text style={styles.greeting}>안녕하세요, 김테니스님</Text>
                </View>

                {/* 상단 통계 카드들 - 홈과 동일 */}
                <View style={styles.statsSection}>
                    <View style={[styles.statCard, { backgroundColor: cardBackgroundColor }]}>
                        <Ionicons name="time-outline" size={24} color="#666" style={styles.statIcon} />
                        <Text style={styles.statValue}>1시간30분</Text>
                        <Text style={styles.statLabel}>훈련 시간</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: cardBackgroundColor }]}>
                        <Ionicons name="time-outline" size={24} color="#666" style={styles.statIcon} />
                        <Text style={styles.statValue}>56회</Text>
                        <Text style={styles.statLabel}>서브 횟수</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: cardBackgroundColor }]}>
                        <Ionicons name="time-outline" size={24} color="#666" style={styles.statIcon} />
                        <Text style={styles.statValue}>85%</Text>
                        <Text style={styles.statLabel}>정확도</Text>
                    </View>
                </View>

                {/* 훈련 설정 카드 */}
                <View style={[styles.settingsCard, { backgroundColor: cardBackgroundColor }]}>
                    <Text style={styles.cardTitle}>훈련 설정</Text>

                    {/* 강도 설정 */}
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>강도</Text>
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderTrack}>
                                <View
                                    style={[styles.sliderFill, {
                                        width: `${intensity}%`,
                                        backgroundColor: primaryLightColor
                                    }]}
                                />
                            </View>
                            <View style={[styles.sliderThumb, { left: `${Math.max(0, Math.min(92, intensity - 4))}%` }]} />
                        </View>
                    </View>

                    {/* 방향 설정 */}
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>방향</Text>
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderTrack}>
                                <View
                                    style={[styles.sliderFill, {
                                        width: `${direction}%`,
                                        backgroundColor: primaryLightColor
                                    }]}
                                />
                            </View>
                            <View style={[styles.sliderThumb, { left: `${Math.max(0, Math.min(92, direction - 4))}%` }]} />
                        </View>
                    </View>

                    {/* 빈도 설정 */}
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>빈도</Text>
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderTrack}>
                                <View
                                    style={[styles.sliderFill, {
                                        width: `${frequency}%`,
                                        backgroundColor: primaryLightColor
                                    }]}
                                />
                            </View>
                            <View style={[styles.sliderThumb, { left: `${Math.max(0, Math.min(92, frequency - 4))}%` }]} />
                        </View>
                    </View>

                    {/* 시간 설정 */}
                    <View style={styles.timeSection}>
                        <Text style={styles.settingLabel}>시간</Text>
                        <View style={styles.timeControls}>
                            <TouchableOpacity
                                style={[styles.timeButton, { backgroundColor: duration <= 5 ? '#f0f0f0' : '#e0e0e0' }]}
                                onPress={() => adjustDuration(false)}
                                disabled={duration <= 5}
                            >
                                <Text style={[styles.timeButtonText, { color: duration <= 5 ? '#ccc' : '#666' }]}>-</Text>
                            </TouchableOpacity>

                            <Text style={styles.timeValue}>{duration}분</Text>

                            <TouchableOpacity
                                style={[styles.timeButton, { backgroundColor: duration >= 120 ? '#f0f0f0' : '#e0e0e0' }]}
                                onPress={() => adjustDuration(true)}
                                disabled={duration >= 120}
                            >
                                <Text style={[styles.timeButtonText, { color: duration >= 120 ? '#ccc' : '#666' }]}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 훈련 시작 버튼 */}
                <TouchableOpacity
                    style={[styles.startButton, { backgroundColor: primaryLightColor }]}
                    onPress={handleStartTraining}
                >
                    <Text style={styles.startButtonText}>훈련 시작</Text>
                </TouchableOpacity>

                {/* 훈련 모드 선택 */}
                <Text style={styles.sectionTitle}>훈련 모드</Text>
                <View style={styles.modeContainer}>
                    {trainingModes.map((mode) => (
                        <TouchableOpacity
                            key={mode.id}
                            style={[
                                styles.modeCard,
                                { backgroundColor: cardBackgroundColor },
                                selectedMode === mode.id && { borderColor: primaryColor, borderWidth: 2 }
                            ]}
                            onPress={() => handleModeSelect(mode.id)}
                        >
                            <View style={[
                                styles.modeIcon,
                                { backgroundColor: selectedMode === mode.id ? primaryColor + '20' : '#f0f0f0' }
                            ]}>
                                <Ionicons
                                    name={mode.icon as any}
                                    size={24}
                                    color={selectedMode === mode.id ? primaryColor : '#666'}
                                />
                            </View>
                            <Text style={styles.modeTitle}>{mode.title}</Text>
                            <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                        </TouchableOpacity>
                    ))}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileIcon: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    greetingSection: {
        paddingHorizontal: 16,
        marginBottom: 20,
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
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statIcon: {
        marginBottom: 8,
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
    settingsCard: {
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    settingItem: {
        marginBottom: 20,
    },
    settingLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    sliderContainer: {
        position: 'relative',
        height: 20,
    },
    sliderTrack: {
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        position: 'absolute',
        width: '100%',
        top: 7,
    },
    sliderFill: {
        height: '100%',
        borderRadius: 3,
    },
    sliderThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#ddd',
        position: 'absolute',
        top: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    timeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    timeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    timeValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        minWidth: 50,
        textAlign: 'center',
    },
    startButton: {
        borderRadius: 12,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginVertical: 20,
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
    startButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    modeContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    modeCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    modeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    modeTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    modeSubtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});

export default TrainingScreen;