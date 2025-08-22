import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
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

interface TrainingModeSelectorProps {
    selectedMode: 'serve' | 'ai';
    onModeSelect: (mode: 'serve' | 'ai') => void;
}

const TrainingModeSelector: React.FC<TrainingModeSelectorProps> = ({
                                                                       selectedMode,
                                                                       onModeSelect,
                                                                   }) => {
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');
    const primaryColor = useThemeColor({}, 'primary');

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

    return (
        <View style={styles.container}>
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
                        onPress={() => onModeSelect(mode.id)}
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
        color: '#333',
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
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
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

export default TrainingModeSelector;