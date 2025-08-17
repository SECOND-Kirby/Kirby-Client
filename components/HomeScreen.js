import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BallCollectionScreen from './BallCollectionScreen';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [isCollecting, setIsCollecting] = useState(false);

  const handleStartCollection = () => {
    setIsCollecting(true);
  };

  const handleStopCollection = () => {
    setIsCollecting(false);
  };

  // 공 수거 중이면 BallCollectionScreen 표시
  if (isCollecting) {
    return <BallCollectionScreen onStop={handleStopCollection} />;
  }

  // 기본 홈 화면
  return (
    <ScrollView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>홈</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Ionicons name="person-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* 상태 카드 섹션 */}
      <View style={styles.section}>
        <View style={styles.cardContainer}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color="#666" style={styles.statIcon} />
              <Text style={styles.statValue}>1시간30분</Text>
              <Text style={styles.statLabel}>운동 시간</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color="#666" style={styles.statIcon} />
              <Text style={styles.statValue}>56회</Text>
              <Text style={styles.statLabel}>서브 횟수</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color="#666" style={styles.statIcon} />
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>정확도</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 기기 상태 */}
      <View style={styles.section}>
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>기기 상태</Text>
          <View style={styles.batteryContainer}>
            <View style={styles.batteryBar}>
              <View style={[styles.batteryFill, { width: '75%' }]} />
            </View>
            <Text style={styles.batteryText}>배터리 75%</Text>
          </View>
        </View>
      </View>

      {/* 공 보유 개수 */}
      <View style={styles.section}>
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>공 보유 개수</Text>
          <View style={styles.ballCountContainer}>
            <View style={styles.ballCountLeft}>
              <View style={styles.circularProgress}>
                <Text style={styles.percentageText}>70%</Text>
              </View>
            </View>
            <View style={styles.ballCountRight}>
              <Text style={styles.ballCountText}>70 / 100개</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 이번주 활동 */}
      <View style={styles.section}>
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>이번주 활동</Text>
          <View style={styles.chartContainer}>
            {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
              <View key={day} style={styles.chartDay}>
                <View style={[styles.chartBar, { height: Math.random() * 80 + 20 }]} />
                <Text style={styles.chartLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 공 수거 시작 버튼 */}
      <TouchableOpacity style={styles.startButton} onPress={handleStartCollection}>
        <Text style={styles.startButtonText}>공 수거 시작</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileIcon: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    marginBottom: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
  },
  batteryFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  batteryText: {
    fontSize: 14,
    color: '#666',
  },
  ballCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  ballCountLeft: {
    flex: 3,
    alignItems: 'center',
  },
  ballCountRight: {
    flex: 4,
    alignItems: 'center',
  },
  circularProgress: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#E7FF65',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ballCountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  chartDay: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 20,
    backgroundColor: '#E7FF65',
    borderRadius: 2,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#B2C549',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 40,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;