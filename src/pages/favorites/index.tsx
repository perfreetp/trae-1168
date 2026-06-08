import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface FavoriteItem {
  id: string;
  name: string;
  type: string;
  portName: string;
  price: number;
  sharedPrice: number;
  image: string;
}

const initialFavorites: FavoriteItem[] = [
  { id: 'b1', name: '海风号', type: '休闲钓鱼艇', portName: '嵊泗列岛港', price: 2800, sharedPrice: 380, image: 'https://picsum.photos/id/1015/200/200' },
  { id: 'b2', name: '蓝鲸号', type: '远海钓船', portName: '南澳岛港', price: 4200, sharedPrice: 420, image: 'https://picsum.photos/id/1039/200/200' },
  { id: 'b4', name: '乘风号', type: '豪华钓船', portName: '三亚港', price: 5600, sharedPrice: 580, image: 'https://picsum.photos/id/1044/200/200' },
];

const FavoritesPage: React.FC = () => {
  const [list, setList] = useState<FavoriteItem[]>(initialFavorites);

  const handleRemove = (id: string) => {
    setList((prev) => prev.filter((item) => item.id !== id));
    Taro.showToast({ title: '已取消收藏', icon: 'none' });
  };

  const handleItemClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/boat-detail/index?id=${id}` });
  };

  if (list.length === 0) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>❤️</Text>
          <Text className={styles.emptyText}>暂无收藏</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      {list.map((item) => (
        <View key={item.id} className={styles.card} onClick={() => handleItemClick(item.id)}>
          <Image className={styles.image} src={item.image} mode="aspectFill" />
          <View className={styles.info}>
            <Text className={styles.name}>{item.name}</Text>
            <Text className={styles.meta}>{item.type} · {item.portName}</Text>
            <View className={styles.bottomRow}>
              <View>
                <Text className={styles.price}>¥{item.sharedPrice}</Text>
                <Text className={styles.priceUnit}>/人</Text>
              </View>
              <View className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}>
                <Text className={styles.removeBtnText}>取消收藏</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default FavoritesPage;
