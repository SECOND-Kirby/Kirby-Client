// screens/BallCollection/BallCollectionScreen.tsx
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useBallCollectionStore } from '@/store/ballCollectionStore';
import { Colors } from '@/constants/Colors';

interface BallCollectionScreenProps {
  onStop?: () => void;
  onClose?: () => void;
}

const BallCollectionScreen: React.FC<BallCollectionScreenProps> = ({ onStop, onClose }) => {
  const { collectedBalls, totalBalls, progress } = useBallCollectionStore();

  return (
      <View style={styles.container}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Text style={styles.statusText}>현재 공을 줍는 중입니다...</Text>
          {onClose && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
          )}
        </View>

        {/* 공 수거 차량 이미지 */}
        <View style={styles.vehicleContainer}>
          <Image
              source={require('@/assets/images/ball-collection-vehicle.png')}
              style={styles.vehicleImage}
              resizeMode="contain"
          />
        </View>

        {/* 공수거 현황 카드 */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>공수거 현황</Text>
          <View style={styles.statusContainer}>
            <View style={styles.circularProgress}>
              <Text style={styles.percentageText}>{progress}%</Text>
            </View>
            <Text style={styles.countText}>{collectedBalls} / {totalBalls}개</Text>
          </View>
        </View>

        {/* 공수거 중지 버튼 */}
        <TouchableOpacity style={styles.stopButton} onPress={onStop}>
          <Text style={styles.stopButtonText}>공수거 중지</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
  },
  statusText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.main,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.text.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.main,
  },
  vehicleContainer: {
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  vehicleImage: {
    width: '100%',
    height: 200,
  },
  statusCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
    width: '100%',
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
    color: Colors.text.main,
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  circularProgress: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.main,
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.main,
  },
  stopButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
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
  stopButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
});

export default BallCollectionScreen;