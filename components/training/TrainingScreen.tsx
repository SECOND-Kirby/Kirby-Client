import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useThemeColor} from '@/hooks/useThemeColor';
import TrainingSettingsCard from './TrainingSettingsCard';
import TrainingModeSelector from './TrainingModeSelector';

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

    const handleModeSelect = (mode: 'serve' | 'ai') => {
        setSelectedMode(mode);
    };

    const handleProfilePress = () => {
        router.push('/(tabs)/settings');
    };

    const adjustDuration = (increase: boolean) => {
        const newDuration = increase ? duration + 5 : duration - 5;
        if (newDuration >= 5 && newDuration <= 120) {
            setDuration(newDuration);
        }
    };

    const handleStartTraining = () => {
        // 같은 탭에서 세션 모드로 전환
        router.push({
            pathname: '/(tabs)/training',
            params: {
                sessionMode: 'active',
                duration: duration.toString(),
                mode: selectedMode,
                intensity: intensity.toString(),
                direction: direction.toString(),
                frequency: frequency.toString(),
            }
        });
    };

    return (
        <View style={[styles.container, {backgroundColor}]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* 헤더 - 스크롤 안에 포함 */}
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

                {/* 상단 통계 카드들 - 홈과 동일 */}
                <View style={styles.statsSection}>
                    <View style={[styles.statCard, {backgroundColor: cardBackgroundColor}]}>
                        <Ionicons name="time-outline" size={24} color="#666" style={styles.statIcon}/>
                        <Text style={styles.statValue}>1시간30분</Text>
                        <Text style={styles.statLabel}>훈련 시간</Text>
                    </View>

                    <View style={[styles.statCard, {backgroundColor: cardBackgroundColor}]}>
                        <Ionicons name="time-outline" size={24} color="#666" style={styles.statIcon}/>
                        <Text style={styles.statValue}>56회</Text>
                        <Text style={styles.statLabel}>서브 횟수</Text>
                    </View>

                    <View style={[styles.statCard, {backgroundColor: cardBackgroundColor}]}>
                        <Ionicons name="time-outline" size={24} color="#666" style={styles.statIcon}/>
                        <Text style={styles.statValue}>85%</Text>
                        <Text style={styles.statLabel}>정확도</Text>
                    </View>
                </View>

                {/* 훈련 설정 카드 - 별도 컴포넌트 */}
                <TrainingSettingsCard
                    intensity={intensity}
                    direction={direction}
                    frequency={frequency}
                    duration={duration}
                    onIntensityChange={setIntensity}
                    onDirectionChange={setDirection}
                    onFrequencyChange={setFrequency}
                    onDurationChange={adjustDuration}
                />

                {/* 훈련 시작 버튼 */}
                <TouchableOpacity
                    style={[styles.startButton, {backgroundColor: primaryLightColor}]}
                    onPress={handleStartTraining}
                >
                    <Text style={styles.startButtonText}>훈련 시작</Text>
                </TouchableOpacity>

                {/* 훈련 모드 선택 - 별도 컴포넌트 */}
                <TrainingModeSelector
                    selectedMode={selectedMode}
                    onModeSelect={handleModeSelect}
                />
            </ScrollView>
        </View>
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
        paddingBottom: 16,
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
});

export default TrainingScreen;