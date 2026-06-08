import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface BlacklistItem {
  id: string;
  name: string;
  type: string;
  portName: string;
  reason: string;
  image: string;
}

const initialBlacklist: BlacklistItem[] = [
  { id: 'b3', name: '渔乐号', type: '近海钓鱼艇', portName: '大陈岛港', reason: '多次迟到出发', image: 'https://picsum.photos/id/1018/200/200' },
  { id: 'b8', name: '飞鱼号', type: '快艇钓船', portName: '平潭岛港', reason: '装备与描述不符', image: 'https://picsum.photos/id/1036/200/200' },
];

const BlacklistPage: React.FC = () => {
  const [list, setList] = useState<BlacklistItem[]>(initialBlacklist);

  const handleRemove = (id: string) => {
    setList((prev) => prev.filter((item) => item.id !== id));
    Taro.showToast({ title: '已移出黑名单', icon: 'none' });
  };

  if (list.length === 0) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>🚫</Text>
          <Text className={styles.emptyText}>暂无黑名单</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      {list.map((item) => (
        <View key={item.id} className={styles.card}>
          <Image className={styles.image} src={item.image} mode="aspectFill" />
          <View className={styles.info}>
            <View>
              <Text className={styles.name}>{item.name}</Text>
              <Text className={styles.meta}>{item.type} · {item.portName}</Text>
              <Text className={styles.reason}>拉黑原因：{item.reason}</Text>
            </View>
            <View className={styles.removeBtn} onClick={() => handleRemove(item.id)}>
              <Text className={styles.removeBtnText}>移出黑名单</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default BlacklistPage;
