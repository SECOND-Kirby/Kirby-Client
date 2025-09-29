import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

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
    const backgroundColor = useThemeColor({}, 'background');

    return (
        <View style={[styles.header, { backgroundColor }]}>
            <Text style={styles.headerTitle}>{title}</Text>
            {rightComponent || (showProfile && (
                <TouchableOpacity style={styles.profileIcon} onPress={onProfilePress}>
                    <Ionicons name="person-outline" size={24} color="#666" />
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
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileIcon: {
        padding: 8,
    },
});

export default ScreenHeader;