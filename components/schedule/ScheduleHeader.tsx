// components/schedule/ScheduleHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface ScheduleHeaderProps {
    onBack: () => void;
    onAdd: () => void;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ onBack, onAdd }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
                activeOpacity={0.7}
            >
                <Ionicons name="chevron-back" size={24} color={Colors.text.main} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>스케줄</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={onAdd}
                activeOpacity={0.7}
            >
                <Ionicons name="add" size={24} color={Colors.text.main} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text.main,
        flex: 1,
        textAlign: 'center',
    },
    addButton: {
        padding: 8,
    },
});

export default ScheduleHeader;