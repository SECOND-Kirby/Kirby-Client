import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface SettingItemProps {
    icon: string;
    title: string;
    value?: string;
    onPress?: () => void;
    hasToggle?: boolean;
    toggleValue?: boolean;
    onToggleChange?: (value: boolean) => void;
    showArrow?: boolean;
    iconColor?: string;
}

export const SettingItem: React.FC<SettingItemProps> = ({
                                                            icon,
                                                            title,
                                                            value,
                                                            onPress,
                                                            hasToggle = false,
                                                            toggleValue = false,
                                                            onToggleChange = () => {},
                                                            showArrow = true,
                                                            iconColor = Colors.primary
                                                        }) => {
    return (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={hasToggle}
        >
            <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                    <Ionicons
                        name={icon as any}
                        size={18}
                        color={iconColor}
                    />
                </View>
                <Text style={styles.settingTitle}>{title}</Text>
            </View>
            <View style={styles.settingRight}>
                {hasToggle ? (
                    <View style={styles.customToggle}>
                        <TouchableOpacity
                            style={[
                                styles.toggleContainer,
                                toggleValue ? [styles.toggleActive, { backgroundColor: Colors.primary }] : styles.toggleInactive,
                            ]}
                            onPress={() => onToggleChange(!toggleValue)}
                        >
                            <View
                                style={[
                                    styles.toggleThumb,
                                    toggleValue ? styles.thumbActive : styles.thumbInactive,
                                ]}
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {value && <Text style={styles.settingValue}>{value}</Text>}
                        {showArrow && <Ionicons name="chevron-forward" size={16} color="#ccc" />}
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingTitle: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    customToggle: {
        alignItems: 'center',
    },
    toggleContainer: {
        width: 44,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        position: 'relative',
    },
    toggleActive: {},
    toggleInactive: {
        backgroundColor: '#e0e0e0',
    },
    toggleThumb: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'white',
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    thumbActive: {
        right: 2,
    },
    thumbInactive: {
        left: 2,
    },
});