import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

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
    const cardBackgroundColor = useThemeColor({}, 'cardBackground');

    return (
        <View style={[styles.statCard, { backgroundColor: cardBackgroundColor }]}>
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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
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
        color: '#333',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});

export default StatsCard;