import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface GoalSettingScreenProps {}

const GoalSettingScreen: React.FC<GoalSettingScreenProps> = () => {
  const params = useLocalSearchParams();
  const [value, setValue] = useState(24);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('24');
  const [goalType, setGoalType] = useState<'time' | 'serve'>('time');
  const [title, setTitle] = useState('일일 운동 시간');
  const [unit, setUnit] = useState('시간');
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(24);

  useEffect(() => {
    // URL 파라미터에서 타입과 초기값 받아오기 (한 번만 실행)
    if (params.type === 'serve') {
      setGoalType('serve');
      setTitle('서브 횟수 목표');
      setUnit('회');
      setMinValue(1);
      setMaxValue(100);
      const initialValue = params.serveGoal ? parseInt(params.serveGoal as string) : 50;
      setValue(initialValue);
      setInputValue(initialValue.toString());
    } else {
      setGoalType('time');
      setTitle('일일 운동 시간');
      setUnit('시간');
      setMinValue(1);
      setMaxValue(24);
      const initialValue = params.dailyGoalHours ? parseInt(params.dailyGoalHours as string) : 24;
      setValue(initialValue);
      setInputValue(initialValue.toString());
    }
  }, [params.type, params.dailyGoalHours, params.serveGoal]);

  const handleBack = () => {
    router.back();
  };

  const adjustValue = (increment: boolean) => {
    const newValue = increment ? value + 1 : value - 1;
    if (newValue >= minValue && newValue <= maxValue) {
      setValue(newValue);
      setInputValue(newValue.toString());
    }
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handleInputSubmit = () => {
    const newValue = parseInt(inputValue);
    if (!isNaN(newValue) && newValue >= minValue && newValue <= maxValue) {
      setValue(newValue);
      setIsEditing(false);
    } else {
      Alert.alert('알림', `${minValue}~${maxValue}${unit} 범위로 입력해주세요.`);
      setInputValue(value.toString());
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    // 설정 화면으로 값 전달하며 돌아가기
    router.replace({
      pathname: '/(tabs)/settings',
      params: {
        [goalType === 'time' ? 'updatedDailyGoalHours' : 'updatedServeGoal']: value.toString()
      }
    });
  };

  const ArrowButton = ({ 
    direction, 
    onPress, 
    disabled = false 
  }: { 
    direction: 'up' | 'down'; 
    onPress: () => void; 
    disabled?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.arrowButton, disabled && styles.arrowButtonDisabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons 
        name={direction === 'up' ? 'chevron-up' : 'chevron-down'} 
        size={24} 
        color={disabled ? '#ccc' : '#666'} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* 목표 조절 섹션 */}
        <View style={styles.goalSection}>
          <Text style={styles.goalTitle}>{title}</Text>
          
          <View style={styles.goalControls}>
            <ArrowButton 
              direction="up" 
              onPress={() => adjustValue(true)}
              disabled={value >= maxValue}
            />
            
            <View style={styles.goalValueContainer}>
              {isEditing ? (
                <TextInput
                  key={`input-${value}`}
                  style={styles.goalInput}
                  value={inputValue}
                  onChangeText={handleInputChange}
                  onSubmitEditing={handleInputSubmit}
                  onBlur={handleInputSubmit}
                  keyboardType="numeric"
                  autoFocus
                  selectTextOnFocus
                />
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text key={`text-${value}`} style={styles.goalValue}>{value}</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.goalUnit}>{unit}</Text>
            </View>
            
            <ArrowButton 
              direction="down" 
              onPress={() => adjustValue(false)}
              disabled={value <= minValue}
            />
          </View>
          
          {/* 범위 안내 */}
          <Text style={styles.rangeText}>
            {minValue}~{maxValue}{unit} 설정 가능
          </Text>
        </View>

        {/* 저장 버튼 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  goalSection: {
    alignItems: 'center',
    marginBottom: 80,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 50,
  },
  goalControls: {
    alignItems: 'center',
  },
  arrowButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  arrowButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e8e8e8',
  },
  goalValueContainer: {
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  goalValue: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    minWidth: 120,
  },
  goalInput: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    minWidth: 120,
    borderBottomWidth: 3,
    borderBottomColor: '#B2C549',
    paddingBottom: 5,
  },
  goalUnit: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  rangeText: {
    fontSize: 14,
    color: '#999',
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#E7FF65',
    borderRadius: 12,
    paddingVertical: 16,
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
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default GoalSettingScreen;