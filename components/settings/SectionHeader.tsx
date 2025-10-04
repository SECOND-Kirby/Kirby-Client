import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

interface SectionHeaderProps {
    title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
    return <Text style={styles.sectionHeader}>{title}</Text>;
};

const styles = StyleSheet.create({
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 8,
        marginTop: 10,
    },
});