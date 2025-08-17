import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const BallCollectionScreen = ({ onStop }) => {
  return (
    <View style={styles.container}>
      {/* 상단 텍스트 */}
      <Text style={styles.statusText}>현재 공을 줍는 중입니다...</Text>

      {/* 공 수거 차량 이미지 - PNG 파일 사용 */}
      <View style={styles.vehicleContainer}>
        <Image 
          source={require('@/assets/images/ball-collection-vehicle.png')} 
          style={styles.vehicleImage}
          resizeMode="contain"
        />
        {/* PNG 파일이 없을 경우를 대비한 fallback 차량 디자인 */}
        {/* 
        <View style={styles.vehicle}>
          <View style={styles.vehicleBody}>
            <View style={styles.ballsContainer}>
              <View style={styles.ball} />
              <View style={styles.ball} />
              <View style={styles.ball} />
              <View style={styles.ball} />
            </View>
          </View>
          <View style={styles.wheels}>
            <View style={styles.wheel} />
            <View style={styles.wheel} />
          </View>
        </View>
        */}
      </View>

      {/* 공수거 현황 카드 */}
      <View style={styles.statusCard}>
        <Text style={styles.cardTitle}>공수거 현황</Text>
        <View style={styles.statusContainer}>
          <View style={styles.circularProgress}>
            <Text style={styles.percentageText}>70%</Text>
          </View>
          <Text style={styles.countText}>70 / 100개</Text>
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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 50,
    textAlign: 'center',
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
  // Fallback 차량 디자인 (PNG 파일이 없을 경우)
  vehicle: {
    position: 'relative',
    alignItems: 'center',
  },
  vehicleBody: {
    width: 140,
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    position: 'relative',
    marginBottom: 10,
  },
  ballsContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  ball: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E7FF65',
    margin: 3,
  },
  wheels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    position: 'absolute',
    bottom: -15,
    left: 0,
    right: 0,
  },
  wheel: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#333',
    borderWidth: 3,
    borderColor: '#555',
  },
  statusCard: {
    backgroundColor: 'white',
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
    color: '#333',
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
    borderColor: '#E7FF65',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stopButton: {
    backgroundColor: '#E7FF65',
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%', // 카드와 같은 너비
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
    color: '#333',
  },
});

export default BallCollectionScreen;