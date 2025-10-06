// src/screens/setting/DailyGoalSettingScreen.tsx
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { GoalAdjuster, GoalAdjusterRef } from '@/components/settings/GoalAdjuster';
import { Button } from '@/components/shared/ui/Button';
import { Colors } from '@/constants/Colors';
import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { useAlert } from '@/hooks/useAlert';

const MIN_VALUE = 1;
const MAX_VALUE = 24;

const DailyGoalSettingScreen: React.FC = () => {
    const { dailyGoalHours, setDailyGoalHours } = useSettingsStore();
    const { showAlert } = useAlert();
    const [tempValue, setTempValue] = useState(dailyGoalHours);
    const adjusterRef = useRef<GoalAdjusterRef>(null);

    useFocusEffect(
        useCallback(() => {
            setTempValue(dailyGoalHours);
        }, [dailyGoalHours])
    );

    const handleSave = () => {
        const isEditing = adjusterRef.current?.isCurrentlyEditing() ?? false;

        let valueToValidate: number;

        if (isEditing) {
            const pendingInput = adjusterRef.current?.getPendingInputValue() ?? '';
            const parsedValue = parseInt(pendingInput);

            if (!pendingInput.trim() || isNaN(parsedValue)) {
                showAlert('알림', '올바른 값을 입력해주세요.');
                return;
            }

            valueToValidate = parsedValue;
        } else {
            valueToValidate = adjusterRef.current?.getCurrentValue() ?? tempValue;
        }

        if (valueToValidate < MIN_VALUE || valueToValidate > MAX_VALUE) {
            showAlert('알림', `${MIN_VALUE}~${MAX_VALUE}시간 범위로 설정해주세요.`);
            return;
        }

        setDailyGoalHours(valueToValidate);
        showAlert('알림', '목표가 저장되었습니다.', () => {
            router.back();
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <SettingsHeader title="일일 운동 시간" />

            <View style={styles.content}>
                <Text style={styles.title}>하루에 얼마나 운동하시나요?</Text>
                <Text style={styles.subtitle}>
                    목표를 설정하고 꾸준한 운동 습관을 만들어보세요
                </Text>

                <GoalAdjuster
                    ref={adjusterRef}
                    initialValue={dailyGoalHours}
                    minValue={MIN_VALUE}
                    maxValue={MAX_VALUE}
                    unit="시간"
                    onValueChange={setTempValue}
                />

                <View style={styles.buttonContainer}>
                    <Button title="저장" onPress={handleSave} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.card,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text.main,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 40,
    },
});

export default DailyGoalSettingScreen;