import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import type { Schedule } from '@/types';
import styles from './index.module.scss';

interface ScheduleCardProps {
  schedule: Schedule;
  onClick?: (id: string) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, onClick }) => {
  const isFull = schedule.availableSeats === 0;

  return (
    <View
      className={classnames(styles.card, isFull && styles.full)}
      onClick={() => !isFull && onClick?.(schedule.id)}
    >
      <Image className={styles.image} src={schedule.image} mode="aspectFill" />
      <View className={styles.info}>
        <View className={styles.top}>
          <Text className={styles.boatName}>{schedule.boatName}</Text>
          <View className={classnames(styles.tideTag, styles[schedule.tideLevel])}>
            <Text className={styles.tideText}>{schedule.tide}</Text>
          </View>
        </View>
        <Text className={styles.portName}>{schedule.portName}</Text>
        <View className={styles.timeRow}>
          <Text className={styles.time}>{schedule.startTime} - {schedule.endTime}</Text>
        </View>
        <View className={styles.bottom}>
          <View className={styles.seatsWrap}>
            {isFull ? (
              <Text className={styles.fullText}>已满</Text>
            ) : (
              <Text className={styles.seats}>余{schedule.availableSeats}位</Text>
            )}
          </View>
          <View className={styles.priceWrap}>
            <Text className={styles.price}>¥{schedule.sharedPrice}</Text>
            <Text className={styles.priceUnit}>/人</Text>
            <Text className={styles.wholePrice}>整船 ¥{schedule.price}</Text>
          </View>
        </View>
        <View className={styles.fishTags}>
          {schedule.fishTypes.slice(0, 3).map((fish) => (
            <View key={fish} className={styles.fishTag}>
              <Text className={styles.fishTagText}>{fish}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ScheduleCard;
