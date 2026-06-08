import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { WeatherInfo } from '@/types';
import { getSuitabilityText } from '@/utils';
import styles from './index.module.scss';

interface WeatherCardProps {
  weather: WeatherInfo;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <Text className={styles.title}>今日出海天气</Text>
        <View className={classnames(styles.badge, styles[weather.suitability])}>
          <Text className={styles.badgeText}>{getSuitabilityText(weather.suitability)}</Text>
        </View>
      </View>
      <View className={styles.body}>
        <View className={styles.row}>
          <View className={styles.item}>
            <Text className={styles.label}>天气</Text>
            <Text className={styles.value}>{weather.weather}</Text>
          </View>
          <View className={styles.item}>
            <Text className={styles.label}>气温</Text>
            <Text className={styles.value}>{weather.temperature}°C</Text>
          </View>
          <View className={styles.item}>
            <Text className={styles.label}>风向</Text>
            <Text className={styles.value}>{weather.windDirection}</Text>
          </View>
          <View className={styles.item}>
            <Text className={styles.label}>风力</Text>
            <Text className={styles.value}>{weather.windLevel}级</Text>
          </View>
        </View>
        <View className={styles.tideRow}>
          <Text className={styles.tideLabel}>潮汐</Text>
          <Text className={styles.tideValue}>{weather.tide}</Text>
          <Text className={styles.tideTime}>{weather.tideTime}</Text>
        </View>
      </View>
    </View>
  );
};

export default WeatherCard;
