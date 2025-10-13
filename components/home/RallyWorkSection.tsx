// components/home/RallyWorkSection.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { shadowPresets } from '@/utils/styles';

const RallyWorkSection: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>랠리 워크</Text>
                <Text style={styles.description}>
                    당신의 개인 테니스 훈련을 위한
                </Text>
                <View style={styles.highlightContainer}>
                    <Text style={styles.highlightText}>서포트 솔루션</Text>
                    <View style={styles.highlightLine} />
                </View>
            </View>
            <Image
                source={require('@/assets/images/kirby.png')}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...shadowPresets.button,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    highlightContainer: {
        alignSelf: 'flex-start',
        position: 'relative',
    },
    highlightText: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '600',
        zIndex: 1,
    },
    highlightLine: {
        position: 'absolute',
        bottom: 2,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: '#FFEB3B',
        opacity: 0.6,
        zIndex: 0,
    },
    image: {
        width: 120,
        height: 80,
    },
});

export default RallyWorkSection;