import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UserInfo } from '@/services/authService';
import { Colors } from '@/constants/Colors';

interface ProfileSectionProps {
    user: UserInfo | null;
    onEditPress: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
                                                                  user,
                                                                  onEditPress,
                                                              }) => {
    return (
        <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
                <View style={styles.profileImageContainer}>
                    <Ionicons name="person" size={30} color={Colors.icon.placeholder} />
                </View>
                <View style={styles.profileText}>
                    <Text style={styles.profileName}>{user?.name || '사용자'}</Text>
                    <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.editButton}
                onPress={onEditPress}
            >
                <Text style={styles.editButtonText}>프로필 편집</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    profileSection: {
        backgroundColor: Colors.background.card,
        padding: 20,
        marginBottom: 30,
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    profileImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.profile.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    profileText: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.main,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    editButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
});