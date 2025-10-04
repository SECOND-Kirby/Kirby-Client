// components/home/UpcomingScheduleCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Schedule } from '@/types/schedule';

interface UpcomingScheduleCardProps {
    schedule: Schedule;
}

const UpcomingScheduleCard: React.FC<UpcomingScheduleCardProps> = ({ schedule }) => {
    const handlePress = () => {
        router.push('/(tabs)/schedule');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const dayName = days[date.getDay()];

        return `${month}월 ${day}일 ${dayName}`;
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
            <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={24} color="#2D5016" />
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>예정된 일정</Text>
                <Text style={styles.date}>{formatDate(schedule.date)}</Text>
                <Text style={styles.title}>{schedule.title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#A4D65E',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
    content: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D5016',
        marginBottom: 4,
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
});

export default UpcomingScheduleCard;