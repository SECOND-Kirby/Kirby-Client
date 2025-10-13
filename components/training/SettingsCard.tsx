// components/training/SettingsCard.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { shadowPresets } from '@/utils/styles';

interface SettingsCardProps {
    intensity: number;
    direction: number;
    frequency: number;
    duration: number;
    onIntensityChange: (value: number) => void;
    onDirectionChange: (value: number) => void;
    onFrequencyChange: (value: number) => void;
    onDurationChange: (increase: boolean) => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
                                                       intensity,
                                                       direction,
                                                       frequency,
                                                       duration,
                                                       onIntensityChange,
                                                       onDirectionChange,
                                                       onFrequencyChange,
                                                       onDurationChange,
                                                   }) => {
    const CustomSlider = ({
                              value,
                              onValueChange
                          }: {
        value: number;
        onValueChange: (val: number) => void;
    }) => {
        const handlePress = (event: any) => {
            const { locationX } = event.nativeEvent;
            const sliderWidth = 150;
            const newValue = Math.max(0, Math.min(100, Math.round((locationX / sliderWidth) * 100)));
            onValueChange(newValue);
        };

        return (
            <View style={styles.sliderContainer} onStartShouldSetResponder={() => true} onResponderGrant={handlePress}>
                <View style={styles.sliderTrack}>
                    <View
                        style={[
                            styles.sliderFill,
                            { width: `${value}%` }
                        ]}
                    />
                </View>
                <View
                    style={[
                        styles.sliderThumb,
                        { left: `${Math.max(0, Math.min(90, value - 5))}%` }
                    ]}
                />
            </View>
        );
    };

    const SliderSetting = ({
                               label,
                               value,
                               onValueChange
                           }: {
        label: string;
        value: number;
        onValueChange: (value: number) => void;
    }) => (
        <View style={styles.settingItem}>
            <View style={styles.settingRowHorizontal}>
                <Text style={styles.settingLabel}>{label}</Text>
                <Text style={styles.valueText}>{value}</Text>
                <CustomSlider value={value} onValueChange={onValueChange} />
            </View>
        </View>
    );

    return (
        <View style={styles.settingsCard}>
            <Text style={styles.cardTitle}>훈련 설정</Text>

            <SliderSetting
                label="강도"
                value={intensity}
                onValueChange={onIntensityChange}
            />

            <SliderSetting
                label="빈도"
                value={frequency}
                onValueChange={onFrequencyChange}
            />

            <View style={styles.timeSection}>
                <View style={styles.timeRowHorizontal}>
                    <Text style={styles.settingLabel}>시간</Text>
                    <View style={styles.timeControls}>
                        <TouchableOpacity
                            style={styles.timeButton}
                            onPress={() => onDurationChange(false)}
                            disabled={duration <= 5}
                        >
                            <Text style={[styles.timeButtonText, {
                                color: duration <= 5 ? Colors.disabled : Colors.text.main
                            }]}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.timeValue}>{duration}분</Text>

                        <TouchableOpacity
                            style={styles.timeButton}
                            onPress={() => onDurationChange(true)}
                            disabled={duration >= 120}
                        >
                            <Text style={[styles.timeButtonText, {
                                color: duration >= 120 ? Colors.disabled : Colors.text.main
                            }]}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    settingsCard: {
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 24,
        marginBottom: 20,
        backgroundColor: Colors.background.card,
        ...shadowPresets.small,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text.main,
        marginBottom: 32,
    },
    settingItem: {
        marginBottom: 24,
    },
    settingRowHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.text.main,
        width: 50,
    },
    valueText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.main,
        width: 30,
        marginLeft: 20,
    },
    sliderContainer: {
        position: 'relative',
        width: 150,
        height: 24,
        marginLeft: 20,
        justifyContent: 'center',
    },
    sliderTrack: {
        height: 8,
        backgroundColor: Colors.background.progressBar,
        borderRadius: 4,
        width: '100%',
    },
    sliderFill: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: Colors.primary,
        minWidth: 8,
    },
    sliderThumb: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.background.card,
        borderWidth: 2,
        borderColor: Colors.icon.arrow,
        top: 2,
        ...shadowPresets.small,
    },
    timeSection: {
        marginBottom: 16,
    },
    timeRowHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 70,
        gap: 16,
    },
    timeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.button.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    timeValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.main,
        minWidth: 60,
        textAlign: 'center',
    },
});

export default SettingsCard;