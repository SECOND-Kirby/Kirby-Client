// components/shared/layout/ScreenHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface ScreenHeaderProps {
    title: string;
    showBack?: boolean;
    showAdd?: boolean;
    onBackPress?: () => void;
    onAddPress?: () => void;
    rightComponent?: React.ReactNode;
    leftComponent?: React.ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
                                                       title,
                                                       showBack = false,
                                                       showAdd = false,
                                                       onBackPress,
                                                       onAddPress,
                                                       rightComponent,
                                                       leftComponent,
                                                   }) => {
    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {leftComponent || (showBack && (
                    <TouchableOpacity
                        onPress={handleBackPress}
                        style={styles.iconButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="chevron-back" size={24} color={Colors.text.main} />
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.headerTitle}>{title}</Text>

            <View style={styles.rightContainer}>
                {rightComponent || (showAdd && (
                    <TouchableOpacity
                        onPress={onAddPress}
                        style={styles.iconButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="add" size={28} color={Colors.text.main} />
                    </TouchableOpacity>
                ))}
            </View>
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
    leftContainer: {
        width: 40,
        alignItems: 'flex-start',
    },
    rightContainer: {
        width: 40,
        alignItems: 'flex-end',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.main,
    },
    iconButton: {
        padding: 4,
    },
});

export default ScreenHeader;