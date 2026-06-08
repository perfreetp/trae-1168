import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import type { FishSpecies } from '@/types';
import styles from './index.module.scss';

interface FishTagProps {
  fish: FishSpecies;
  onClick?: (id: string) => void;
}

const FishTag: React.FC<FishTagProps> = ({ fish, onClick }) => {
  return (
    <View className={styles.tag} onClick={() => onClick?.(fish.id)}>
      <Image className={styles.image} src={fish.image} mode="aspectFill" />
      <Text className={styles.name}>{fish.name}</Text>
      <Text className={styles.season}>{fish.season}</Text>
    </View>
  );
};

export default FishTag;
