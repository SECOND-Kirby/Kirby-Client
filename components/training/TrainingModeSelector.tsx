// components/training/TrainingModeSelector.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TrainingMode, TrainingModeOption } from '@/types/training';

interface TrainingModeSelectorProps {
    selectedMode: TrainingMode;
    onModeSelect: (mode: TrainingMode) => void;
}

const TrainingModeSelector: React.FC<TrainingModeSelectorProps> = ({
                                                                       selectedMode,
                                                                       onModeSelect,
                                                                   }) => {
    const trainingModes: TrainingModeOption[] = [
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

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>훈련 모드</Text>
            <View style={styles.modeContainer}>
                {trainingModes.map((mode) => (
                    <TouchableOpacity
                        key={mode.id}
                        style={[
                            styles.modeCard,
                            selectedMode === mode.id && styles.modeCardSelected
                        ]}
                        onPress={() => onModeSelect(mode.id)}
                    >
                        <View style={[
                            styles.modeIcon,
                            { backgroundColor: selectedMode === mode.id ? Colors.primary + '20' : Colors.disabled }
                        ]}>
                            <Ionicons
                                name={mode.icon as any}
                                size={24}
                                color={selectedMode === mode.id ? Colors.primary : Colors.text.secondary}
                            />
                        </View>
                        <Text style={styles.modeTitle}>{mode.title}</Text>
                        <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.main,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    modeContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
    },
    modeCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.background.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    modeCardSelected: {
        borderColor: Colors.primary,
        borderWidth: 2,
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
        color: Colors.text.main,
        marginBottom: 4,
        textAlign: 'center',
    },
    modeSubtitle: {
        fontSize: 12,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
});

export default TrainingModeSelector;