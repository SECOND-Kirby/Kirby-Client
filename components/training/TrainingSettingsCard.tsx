import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TrainingSettingsCardProps {
    intensity: number;
    direction: number;
    frequency: number;
    duration: number;
    onIntensityChange: (value: number) => void;
    onDirectionChange: (value: number) => void;
    onFrequencyChange: (value: number) => void;
    onDurationChange: (increase: boolean) => void;
}

const TrainingSettingsCard: React.FC<TrainingSettingsCardProps> = ({
                                                                       intensity,
                                                                       direction,
                                                                       frequency,
                                                                       duration,
                                                                       onIntensityChange,
                                                                       onDirectionChange,
                                                                       onFrequencyChange,
                                                                       onDurationChange,
                                                                   }) => {
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');
    const primaryLightColor = useThemeColor({}, 'primaryLight');

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
            <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>{label}</Text>
                <View style={styles.sliderWrapper}>
                    <TouchableOpacity
                        style={[styles.sliderButton, { marginRight: 8 }]}
                        onPress={() => onValueChange(Math.max(0, value - 10))}
                    >
                        <Text style={styles.sliderButtonText}>-</Text>
                    </TouchableOpacity>

                    <View style={styles.sliderContainer}>
                        <View style={styles.sliderTrack}>
                            <View
                                style={[styles.sliderFill, {
                                    width: `${value}%`,
                                    backgroundColor: primaryLightColor
                                }]}
                            />
                        </View>
                        <View style={[styles.sliderThumb, { left: `${Math.max(0, Math.min(88, value * 0.88))}%` }]} />
                    </View>

                    <TouchableOpacity
                        style={[styles.sliderButton, { marginLeft: 8 }]}
                        onPress={() => onValueChange(Math.min(100, value + 10))}
                    >
                        <Text style={styles.sliderButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={[styles.settingsCard, { backgroundColor: cardBackgroundColor }]}>
            <Text style={styles.cardTitle}>훈련 설정</Text>

            <SliderSetting
                label="강도"
                value={intensity}
                onValueChange={onIntensityChange}
            />

            <SliderSetting
                label="방향"
                value={direction}
                onValueChange={onDirectionChange}
            />

            <SliderSetting
                label="빈도"
                value={frequency}
                onValueChange={onFrequencyChange}
            />

            {/* 시간 설정 */}
            <View style={styles.timeSection}>
                <Text style={styles.settingLabel}>시간</Text>
                <View style={styles.timeControls}>
                    <TouchableOpacity
                        style={[styles.timeButton, { backgroundColor: duration <= 5 ? '#f0f0f0' : '#f0f0f0' }]}
                        onPress={() => onDurationChange(false)}
                        disabled={duration <= 5}
                    >
                        <Text style={[styles.timeButtonText, { color: duration <= 5 ? '#ccc' : '#333' }]}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.timeValue}>{duration}분</Text>

                    <TouchableOpacity
                        style={[styles.timeButton, { backgroundColor: duration >= 120 ? '#f0f0f0' : '#f0f0f0' }]}
                        onPress={() => onDurationChange(true)}
                        disabled={duration >= 120}
                    >
                        <Text style={[styles.timeButtonText, { color: duration >= 120 ? '#ccc' : '#333' }]}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 24,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        width: 60,
        paddingLeft: 8,
    },
    sliderWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 30,
    },
    sliderButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    sliderContainer: {
        position: 'relative',
        height: 24,
        flex: 1,
        paddingHorizontal: 4,
    },
    sliderTrack: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        position: 'absolute',
        width: '100%',
        top: 7,
    },
    sliderFill: {
        height: '100%',
        borderRadius: 5,
    },
    sliderThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
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
});

export default TrainingSettingsCard;