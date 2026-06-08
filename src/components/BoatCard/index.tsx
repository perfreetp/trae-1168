import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import type { Boat } from '@/types';
import styles from './index.module.scss';

interface BoatCardProps {
  boat: Boat;
  onClick?: (id: string) => void;
}

const BoatCard: React.FC<BoatCardProps> = ({ boat, onClick }) => {
  return (
    <View className={styles.card} onClick={() => onClick?.(boat.id)}>
      <Image className={styles.image} src={boat.photos[0]} mode="aspectFill" />
      <View className={styles.info}>
        <Text className={styles.name}>{boat.name}</Text>
        <View className={styles.meta}>
          <Text className={styles.type}>{boat.type}</Text>
          <Text className={styles.dot}>·</Text>
          <Text className={styles.port}>{boat.portName}</Text>
        </View>
        <View className={styles.bottom}>
          <View className={styles.rating}>
            <Text className={styles.ratingIcon}>★</Text>
            <Text className={styles.ratingText}>{boat.rating}</Text>
            <Text className={styles.reviewCount}>({boat.reviewCount})</Text>
          </View>
          <View className={styles.priceWrap}>
            <Text className={styles.priceLabel}>拼位</Text>
            <Text className={styles.price}>¥{boat.sharedPrice}</Text>
            <Text className={styles.priceUnit}>/人</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BoatCard;
