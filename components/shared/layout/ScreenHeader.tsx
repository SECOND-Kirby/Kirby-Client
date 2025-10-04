// components/shared/layout/ScreenHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ScreenHeaderProps {
    title: string;
    showProfile?: boolean;
    onProfilePress?: () => void;
    rightComponent?: React.ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
                                                       title,
                                                       showProfile = false,
                                                       onProfilePress,
                                                       rightComponent,
                                                   }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            {rightComponent || (showProfile && (
                <TouchableOpacity style={styles.profileIcon} onPress={onProfilePress}>
                    <Ionicons name="person-outline" size={24} color={Colors.text.secondary} />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: Colors.background.main,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text.main,
    },
    profileIcon: {
        padding: 8,
    },
});

export default ScreenHeader;