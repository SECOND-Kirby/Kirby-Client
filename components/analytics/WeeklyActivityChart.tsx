import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Svg, Text as SvgText } from 'react-native-svg';

interface WeeklyActivityChartProps {
  title?: string;
  data?: number[];
  showTitle?: boolean;
}

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  title = '이번주 활동',
  data = [1.2, 1.8, 0.9, 2.5, 1.6, 2.0, 1.4],
  showTitle = true,
}) => {
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const primaryLightColor = useThemeColor({}, 'primaryLight');
  const screenWidth = Dimensions.get('window').width;

  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const chartWidth = screenWidth - 48;
  const chartHeight = 220;

  const safeData = Array.isArray(data) ? data : [];
  const maxValue = Math.max(...safeData, 0);
  const minValue = 0;

  return (
    <View style={[styles.container, { backgroundColor: cardBackgroundColor }]}>
      {showTitle && <Text style={styles.title}>{title}</Text>}

      <LineChart
        data={{
          labels: days,
          datasets: [
            {
              data: safeData,
              color: () => primaryLightColor,
              strokeWidth: 2,
            },
          ],
        }}
        width={chartWidth}
        height={chartHeight}
        yAxisSuffix="h"
        fromZero
        chartConfig={{
          backgroundColor: cardBackgroundColor,
          backgroundGradientFrom: cardBackgroundColor,
          backgroundGradientTo: cardBackgroundColor,
          decimalPlaces: 1,
          color: () => primaryLightColor,
          labelColor: () => '#666',
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: primaryLightColor,
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        decorator={({ x, y }) => {
          if (!x || !y) return null; // undefined 방지
          return (
            <Svg height={chartHeight} width={chartWidth}>
              {safeData.map((value, index) => (
                <SvgText
                  key={index}
                  x={x(index)}
                  y={y(value) - 10} // 점 위 10px
                  fontSize="12"
                  fill="#333"
                  textAnchor="middle"
                >
                  {value}h
                </SvgText>
              ))}
            </Svg>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
    position: 'relative',
  },
});

export default WeeklyActivityChart;
