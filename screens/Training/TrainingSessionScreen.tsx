// screens/Training/TrainingSessionScreen.tsx
import React, {useState} from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {useThemeColor} from '@/hooks/useThemeColor';
import {useTrainingSession} from '@/hooks/useTrainingSession';
import {TrainingSettings, TrainingMode} from '@/types/training';

// 기존 컴포넌트들을 default import로 가져오기
import {SessionTimer} from '@/components/training/SessionTimer';
import {ProgressBar} from '@/components/training/ProgressBar';
import {SessionStats} from '@/components/training/SessionStats';
import {SessionControls} from '@/components/training/SessionControls';
import {AIFeedback} from '@/components/training/AIFeedback';
import EndTrainingModal from '@/components/training/EndTrainingModal';

const TrainingSessionScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const [showEndModal, setShowEndModal] = useState(false);
    const [feedback] = useState('다음 샷에서는 발끝 스윙을 조금 더 길게 해보세요.');

    const backgroundColor = useThemeColor({}, 'background');

    // URL 파라미터에서 설정 파싱
    const settings: TrainingSettings = {
        mode: (params.mode as TrainingMode) || 'serve',
        intensity: parseInt(params.intensity as string) || 50,
        direction: parseInt(params.direction as string) || 30,
        frequency: parseInt(params.frequency as string) || 40,
        duration: parseInt(params.duration as string) || 60,
    };

    const {
        timeLeft,
        isRunning,
        isStarted,
        sessionData,
        progress,
        formatTime,
        handleStart,
        handlePause,
        handleContinue,
    } = useTrainingSession(settings);

    const handleEndTraining = () => {
        setShowEndModal(true);
    };

    const confirmEndAndSave = async () => {
        setShowEndModal(false);
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor}]}>
            <SessionTimer
                timeLeft={timeLeft}
                mode={settings.mode}
                formatTime={formatTime}
            />

            <ProgressBar progress={progress}/>

            <SessionStats sessionData={sessionData}/>

            {settings.mode === 'ai' && <AIFeedback feedback={feedback}/>}

            <View style={styles.spacer}/>

            <SessionControls
                isStarted={isStarted}
                isRunning={isRunning}
                onStart={handleStart}
                onPause={handlePause}
                onContinue={handleContinue}
                onEnd={handleEndTraining}
            />

            <EndTrainingModal
                visible={showEndModal}
                onCancel={() => setShowEndModal(false)}
                onConfirm={confirmEndAndSave}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1},
    spacer: {flex: 1},
});

export default TrainingSessionScreen;