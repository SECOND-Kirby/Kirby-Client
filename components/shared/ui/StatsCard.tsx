// components/shared/ui/StatsCard.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { shadowPresets } from '@/utils/styles';

interface StatsCardProps {
    icon?: any;
    iconComponent?: React.ReactNode;
    value: string;
    label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
                                                 icon,
                                                 iconComponent,
                                                 value,
                                                 label,
                                             }) => {
    return (
        <View style={styles.statCard}>
            {iconComponent || (
                icon && <Image source={icon} style={styles.statIcon} />
            )}
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    statCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        backgroundColor: Colors.background.card,
        ...shadowPresets.small,
    },
    statIcon: {
        width: 24,
        height: 24,
        marginBottom: 8,
        resizeMode: 'contain',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text.main,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
});

export default StatsCard;