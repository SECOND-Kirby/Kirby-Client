// components/home/UpcomingScheduleCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Schedule } from '@/types/schedule';
import { Colors } from '@/constants/Colors';

interface UpcomingScheduleCardProps {
    schedule: Schedule | null;
    onPress: () => void;
}

const UpcomingScheduleCard: React.FC<UpcomingScheduleCardProps> = ({ schedule, onPress }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}월 ${day}일`;
    };

    const formatTime = (time: string) => {
        return time;
    };

    // 일정이 있는 경우
    if (schedule) {
        return (
            <TouchableOpacity
                style={[styles.card, styles.cardWithSchedule]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="calendar" size={24} color={Colors.text.main} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.label}>예정된 일정</Text>
                    <Text style={styles.dateText}>
                        {formatDate(schedule.date)} {formatTime(schedule.startTime)} ~ {formatTime(schedule.endTime)}
                    </Text>
                    <Text style={styles.title}>{schedule.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    // 일정이 없는 경우
    return (
        <TouchableOpacity
            style={[styles.card, styles.cardWithoutSchedule]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.iconContainerGray}>
                <Ionicons name="calendar-outline" size={24} color={Colors.text.secondary} />
            </View>
            <View style={styles.content}>
                <Text style={styles.labelGray}>예정된 일정 없음</Text>
                <Text style={styles.emptyText}>새로운 일정을 추가해보세요</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardWithSchedule: {
        backgroundColor: Colors.primary,
    },
    cardWithoutSchedule: {
        backgroundColor: Colors.background.neon,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    iconContainerGray: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.background.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.main,
        marginBottom: 4,
    },
    labelGray: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.main,
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.main,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
});

export default UpcomingScheduleCard;