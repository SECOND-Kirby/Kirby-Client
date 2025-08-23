import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useThemeColor} from '@/hooks/useThemeColor';

interface TrainingSessionScreenProps {
    duration: number;
    mode: 'serve' | 'ai';
    intensity: number;
    direction: number;
    frequency: number;
}

const TrainingSessionScreen: React.FC<TrainingSessionScreenProps> = ({
                                                                         duration = 20, // 기본 20분
                                                                         mode = 'serve',
                                                                         intensity = 50,
                                                                         direction = 30,
                                                                         frequency = 40,
                                                                     }) => {
    const [timeLeft, setTimeLeft] = useState(duration * 60); // 분을 초로 변환
    const [isRunning, setIsRunning] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [totalServes, setTotalServes] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [avgSpeed, setAvgSpeed] = useState(0);

    const backgroundColor = useThemeColor({}, 'background');
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');
    const primaryColor = useThemeColor({}, 'primary');
    const primaryLightColor = useThemeColor({}, 'primaryLight');

    // 훈련 세션 전용 색상들
    const timerBackgroundColor = useThemeColor({}, 'timerBackground');
    const timerProgressColor = useThemeColor({}, 'timerProgress');
    const pauseButtonColor = useThemeColor({}, 'pauseButton');
    const resetButtonColor = useThemeColor({}, 'resetButton');
    const continueButtonColor = useThemeColor({}, 'continueButton');
    const startButtonColor = useThemeColor({}, 'startButton');
    const statCardBackgroundColor = useThemeColor({}, 'statCardBackground');
    const statValueColor = useThemeColor({}, 'statValueColor');
    const statLabelColor = useThemeColor({}, 'statLabelColor');

    // 타이머 로직
    useEffect(() => {
        let interval: number;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        // 훈련 완료 처리
                        return 0;
                    }
                    return prev - 1;
                });

                // 더미 데이터 업데이트 (실제로는 로봇에서 데이터 수신)
                if (Math.random() < 0.1) { // 10% 확률로 업데이트
                    setTotalServes(prev => prev + 1);
                    setAccuracy(Math.floor(Math.random() * 20) + 80); // 80-100%
                    setAvgSpeed(Math.floor(Math.random() * 50) + 120); // 120-170km/h
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    // 시간을 MM:SS 형식으로 변환
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 진행률 계산
    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

    const handleStart = () => {
        setIsRunning(true);
        setIsStarted(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleContinue = () => {
        setIsRunning(true);
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsStarted(false);
        setTimeLeft(duration * 60);
        setTotalServes(0);
        setAccuracy(0);
        setAvgSpeed(0);
    };

    const handleEndTraining = () => {
        Alert.alert(
            '훈련을 종료하시겠습니까?',
            '현재까지의 훈련 기록이 저장됩니다.',
            [
                {
                    text: '취소',
                    style: 'cancel',
                },
                {
                    text: '종료',
                    style: 'default',
                    onPress: () => {
                        // 훈련 기록 저장 후 훈련 탭으로 돌아가기
                        router.push('/(tabs)/training');
                    },
                },
            ]
        );
    };

    const handleStop = () => {
        // 훈련 결과 저장 후 메인으로 돌아가기
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor}]}>
            {/* 상단 타이머 영역 */}
            <View style={[styles.timerSection, {backgroundColor: timerBackgroundColor}]}>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                <Text style={styles.modeText}>
                    {mode === 'serve' ? '플랫 서브' : 'AI'} • 와이드 존 타겟
                </Text>
            </View>

            {/* 진행률 바 */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${progress}%`,
                                backgroundColor: timerProgressColor
                            }
                        ]}
                    />
                </View>
            </View>

            {/* 통계 카드들 */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, {backgroundColor: statCardBackgroundColor}]}>
                    <Text style={[styles.statValue, {color: statValueColor}]}>{totalServes}</Text>
                    <Text style={[styles.statLabel, {color: statLabelColor}]}>총 서브</Text>
                </View>

                <View style={[styles.statCard, {backgroundColor: statCardBackgroundColor}]}>
                    <Text style={[styles.statValue, {color: statValueColor}]}>{accuracy}%</Text>
                    <Text style={[styles.statLabel, {color: statLabelColor}]}>정확도</Text>
                </View>

                <View style={[styles.statCard, {backgroundColor: statCardBackgroundColor}]}>
                    <Text style={[styles.statValue, {color: statValueColor}]}>{avgSpeed}km/h</Text>
                    <Text style={[styles.statLabel, {color: statLabelColor}]}>평균속도</Text>
                </View>
            </View>

            {/* AI 코치 피드백 (선택적) */}
            {mode === 'ai' && (
                <View style={[styles.feedbackCard, {backgroundColor: '#E6FFE4'}]}>
                    <View style={styles.feedbackHeader}>
                        <Ionicons name="bulb" size={20} color={primaryColor}/>
                        <Text style={styles.feedbackTitle}>AI 코치 피드백</Text>
                    </View>
                    <Text style={styles.feedbackText}>
                        다음 샷에서는 발끝우스를을 조금 더 길게 해보세요.
                    </Text>
                </View>
            )}

            {/* 여백 */}
            <View style={styles.spacer}/>

            {/* 하단 버튼들 */}
            <View style={[styles.buttonContainer, {backgroundColor: cardBackgroundColor}]}>
                {!isStarted ? (
                    <TouchableOpacity
                        style={[styles.primaryButton, {backgroundColor: startButtonColor}]}
                        onPress={handleStart}
                    >
                        <Text style={styles.primaryButtonText}>훈련 시작</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.controlButtons}>
                        {isRunning ? (
                            <TouchableOpacity
                                style={[styles.secondaryButton, {backgroundColor: pauseButtonColor}]}
                                onPress={handlePause}
                            >
                                <Text style={styles.secondaryButtonText}>일시정지</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[styles.secondaryButton, {backgroundColor: continueButtonColor}]}
                                onPress={handleContinue}
                            >
                                <Text style={styles.secondaryButtonText}>계속하기</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.secondaryButton, {backgroundColor: resetButtonColor}]}
                            onPress={handleReset}
                        >
                            <Text style={styles.secondaryButtonText}>초기화</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    timerSection: {
        paddingVertical: 40,
        alignItems: 'center'
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    modeText: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    progressContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    progressTrack: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 20,
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
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    feedbackCard: {
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#5CB33D',
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    feedbackTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#527D40',
        marginLeft: 8,
    },
    feedbackText: {
        fontSize: 14,
        color: '#6E6E6E',
        lineHeight: 20,
    },
    spacer: {
        flex: 1,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        marginRight: 20,
        marginLeft: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 5,
    },
    primaryButton: {
        borderRadius: 12,
        paddingVertical: 16,
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
    primaryButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    controlButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 16,
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
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default TrainingSessionScreen;