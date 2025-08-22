import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
import { useThemeColor } from '@/hooks/useThemeColor';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [isCollecting, setIsCollecting] = useState(false);

  // 테마 색상 가져오기
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const primaryLightColor = useThemeColor({}, 'primaryLight');

  const handleStartCollection = () => {
    setIsCollecting(true);
  };

  const handleStopCollection = () => {
    setIsCollecting(false);
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/settings');
  };

  // 공 수거 중이면 BallCollectionScreen 표시
  if (isCollecting) {
    return <BallCollectionScreen onStop={handleStopCollection} />;
  }

  // 기본 홈 화면
  return (
      <ScrollView style={[styles.container, { backgroundColor }]}>
        {/* 상단 헤더 */}
        <View style={[styles.header, { backgroundColor }]}>
          <Text style={styles.headerTitle}>홈</Text>
          <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
            <Ionicons name="person-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* 상단 통계 카드들 */}
        <View style={styles.statsSection}>
          <View style={[styles.statCard, { backgroundColor: cardBackgroundColor }]}>
            <Ionicons name="time-outline" size={24} color="#666" style={styles.statIcon} />
            <Text style={styles.statValue}>1시간30분</Text>
            <Text style={styles.statLabel}>운동 시간</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: cardBackgroundColor }]}>
            <Ionicons name="time-outline" size={24} color="#666" style={styles.statIcon} />
            <Text style={styles.statValue}>56회</Text>
            <Text style={styles.statLabel}>서브 횟수</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: cardBackgroundColor }]}>
            <Ionicons name="time-outline" size={24} color="#666" style={styles.statIcon} />
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>정확도</Text>
          </View>
        </View>

        {/* 기기 상태 */}
        <View style={styles.section}>
          <View style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
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
          <View style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={styles.cardTitle}>공 보유 개수</Text>
            <View style={styles.ballCountContainer}>
              <View style={[styles.circularProgress, { borderColor: primaryLightColor }]}>
                <Text style={styles.percentageText}>70%</Text>
              </View>
              <Text style={styles.ballCountText}>70 / 100개</Text>
            </View>
          </View>
        </View>

        {/* 이번주 활동 */}
        <View style={styles.section}>
          <View style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
            <Text style={styles.cardTitle}>이번주 활동</Text>
            <View style={styles.chartContainer}>
              {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => {
                const heights = [90, 70, 60, 40, 20, 65, 55]; // 고정된 높이값
                return (
                    <View key={day} style={styles.chartDay}>
                      <View style={[styles.chartBar, { height: heights[index], backgroundColor: primaryLightColor }]} />
                      <Text style={styles.chartLabel}>{day}</Text>
                    </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* 공 수거 시작 버튼 */}
        <TouchableOpacity style={[styles.startButton, { backgroundColor: primaryLightColor }]} onPress={handleStartCollection}>
          <Text style={styles.startButtonText}>공 수거 시작</Text>
        </TouchableOpacity>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileIcon: {
    padding: 8,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
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
    marginBottom: 8,
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
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cardContainer: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
    justifyContent: 'center',
    gap: 40,
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#f0f0f0',
    borderLeftColor: '#f0f0f0',
  },
  percentageText: {
    fontSize: 18,
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
    height: 120,
    paddingHorizontal: 8,
  },
  chartDay: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
    minHeight: 20,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
  },
  startButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
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