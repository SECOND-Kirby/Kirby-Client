// components/home/HomeHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BRAND_COLORS } from '@/utils/constants';

interface HomeHeaderProps {
    onNextSchedule: () => void;
    isLoading: boolean;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ onNextSchedule, isLoading }) => {
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={styles.header}>
            <View>
                <Text style={[styles.greeting, { color: textColor }]}>
                    안녕하세요! 👋
                </Text>
                <Text style={[styles.subtitle, { color: textColor }]}>
                    오늘도 좋은 훈련 되세요
                </Text>
            </View>
            <TouchableOpacity
                style={styles.nextScheduleButton}
                onPress={onNextSchedule}
                disabled={isLoading}
            >
                <Ionicons name="time-outline" size={20} color="white" />
                <Text style={styles.nextScheduleText}>다음 일정</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
    },
    nextScheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: BRAND_COLORS.green,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    nextScheduleText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default HomeHeader;