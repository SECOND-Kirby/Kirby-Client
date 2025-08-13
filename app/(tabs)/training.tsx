import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TrainingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>운동</Text>
      <Text style={styles.subtitle}>운동 관리 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});