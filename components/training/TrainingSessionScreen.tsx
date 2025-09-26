import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

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
  const [showEndModal, setShowEndModal] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const primaryLightColor = useThemeColor({}, 'primaryLight');

  const timerBackgroundColor = useThemeColor({}, 'timerBackground');
  const timerProgressColor = useThemeColor({}, 'timerProgress');
  const pauseButtonColor = useThemeColor({}, 'pauseButton');
  const resetButtonColor = useThemeColor({}, 'resetButton');
  const continueButtonColor = useThemeColor({}, 'continueButton');
  const startButtonColor = useThemeColor({}, 'startButton');
  const statCardBackgroundColor = useThemeColor({}, 'statCardBackground');
  const statValueColor = useThemeColor({}, 'statValueColor');
  const statLabelColor = useThemeColor({}, 'statLabelColor');

  // AI 코치 피드백 멘트
  const aiFeedbackMessages = [
    "다음 샷에서는 발끝 스윙을 조금 더 길게 해보세요.",
    "자세를 조금 낮추면 정확도가 향상됩니다.",
    "팔꿈치를 조금 더 펴고 컨트롤을 높여보세요.",
    "리듬을 일정하게 유지하면 안정적인 서브가 나옵니다.",
    "힘보다 정확도에 집중해보세요."
  ];

  const [randomFeedback, setRandomFeedback] = useState(
    aiFeedbackMessages[Math.floor(Math.random() * aiFeedbackMessages.length)]
  );

  // 타이머 로직
  useEffect(() => {
    let interval: number;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });

        // 더미 데이터 업데이트
        if (Math.random() < 0.1) {
          setTotalServes((prev) => prev + 1);
          setAccuracy(Math.floor(Math.random() * 20) + 80);
          setAvgSpeed(Math.floor(Math.random() * 50) + 120);

          // AI 모드일 때 피드백도 랜덤 변경
          if (mode === 'ai') {
            setRandomFeedback(
              aiFeedbackMessages[Math.floor(Math.random() * aiFeedbackMessages.length)]
            );
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

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
    setIsRunning(false);
    setShowEndModal(true);
  };

  const confirmEndAndSave = async () => {
    setShowEndModal(false);
    router.push('/training');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.timerSection, { backgroundColor: timerBackgroundColor }]}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.modeText}>
          {mode === 'serve' ? '플랫 서브' : 'AI'} • 와이드 존 타겟
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: timerProgressColor },
            ]}
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: statCardBackgroundColor }]}>
          <Text style={[styles.statValue, { color: statValueColor }]}>{totalServes}</Text>
          <Text style={[styles.statLabel, { color: statLabelColor }]}>총 서브</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: statCardBackgroundColor }]}>
          <Text style={[styles.statValue, { color: statValueColor }]}>{accuracy}%</Text>
          <Text style={[styles.statLabel, { color: statLabelColor }]}>정확도</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: statCardBackgroundColor }]}>
          <Text style={[styles.statValue, { color: statValueColor }]}>{avgSpeed}km/h</Text>
          <Text style={[styles.statLabel, { color: statLabelColor }]}>평균속도</Text>
        </View>
      </View>

      {mode === 'ai' && (
        <View style={[styles.feedbackCard, { backgroundColor: '#E6FFE4' }]}>
          <View style={styles.feedbackHeader}>
            <Ionicons name="bulb" size={20} color={primaryColor} />
            <Text style={styles.feedbackTitle}>AI 코치 피드백</Text>
          </View>
          <Text style={styles.feedbackText}>{randomFeedback}</Text>
        </View>
      )}

      <View style={styles.spacer} />

      <View style={[styles.buttonContainer, { backgroundColor: cardBackgroundColor }]}>
        {!isStarted ? (
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: startButtonColor }]}
            onPress={handleStart}
          >
            <Text style={styles.primaryButtonText}>훈련 시작</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.controlButtons}>
            {isRunning ? (
              <TouchableOpacity
                style={[styles.secondaryButton, { backgroundColor: pauseButtonColor }]}
                onPress={handlePause}
              >
                <Text style={styles.secondaryButtonText}>일시정지</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.secondaryButton, { backgroundColor: continueButtonColor }]}
                onPress={handleContinue}
              >
                <Text style={styles.secondaryButtonText}>계속하기</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: resetButtonColor }]}
              onPress={handleEndTraining}
            >
              <Text style={styles.secondaryButtonText}>훈련 종료</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        transparent
        visible={showEndModal}
        animationType="fade"
        onRequestClose={() => setShowEndModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>훈련을 종료하시겠습니까?</Text>
            <Text style={styles.modalDesc}>현재까지의 훈련 기록이 저장됩니다.</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancel]}
                onPress={() => setShowEndModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: resetButtonColor }]}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalConfirm]}
                onPress={confirmEndAndSave}
              >
                <Text style={styles.modalBtnText}>종료</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  timerSection: { paddingVertical: 40, alignItems: 'center' },
  timerText: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  modeText: { fontSize: 16, color: '#fff', opacity: 0.9 },
  progressContainer: { paddingHorizontal: 20, paddingVertical: 16 },
  progressTrack: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  statValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12, textAlign: 'center' },
  feedbackCard: { marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#5CB33D' },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  feedbackTitle: { fontSize: 14, fontWeight: '600', color: '#527D40', marginLeft: 8 },
  feedbackText: { fontSize: 14, color: '#6E6E6E', lineHeight: 20 },
  spacer: { flex: 1 },
  buttonContainer: { paddingHorizontal: 16, paddingVertical: 20, marginRight: 20, marginLeft: 20, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 5 },
  primaryButton: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  primaryButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  controlButtons: { flexDirection: 'row', gap: 12 },
  secondaryButton: { flex: 1, borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  secondaryButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { width: '100%', maxWidth: 380, borderRadius: 16, backgroundColor: '#fff', padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#111' },
  modalDesc: { fontSize: 14, color: '#555', marginBottom: 16 },
  modalButtons: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  modalCancel: { backgroundColor: '#e5e7eb' },
  modalConfirm: { backgroundColor: '#111827' },
  modalBtnText: { color: '#fff', fontWeight: '600' },
});

export default TrainingSessionScreen;
