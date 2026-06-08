import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const orderMenus = [
  { key: 'pending', label: '待确认', icon: '⏳', count: 1 },
  { key: 'confirmed', label: '待出行', icon: '🚢', count: 2 },
  { key: 'completed', label: '已完成', icon: '✅', count: 5 },
  { key: 'cancelled', label: '已取消', icon: '❌', count: 0 },
];

const serviceMenus = [
  { key: 'favorites', label: '我的收藏', icon: '❤️' },
  { key: 'reviews', label: '我的评价', icon: '⭐' },
  { key: 'invoice', label: '发票管理', icon: '🧾' },
  { key: 'deposit', label: '押金/退款', icon: '💰' },
  { key: 'blacklist', label: '黑名单船只', icon: '🚫' },
];

const settingMenus = [
  { key: 'settings', label: '设置', icon: '⚙️' },
  { key: 'about', label: '关于我们', icon: 'ℹ️' },
  { key: 'help', label: '帮助中心', icon: '❓' },
];

const MinePage: React.FC = () => {
  const handleOrderClick = (key: string) => {
    console.info('[Mine] Order tab clicked:', key);
  };

  const handleMenuClick = (key: string) => {
    console.info('[Mine] Menu clicked:', key);
  };

  return (
    <View className={styles.page}>
      <View className={styles.profileCard}>
        <Image
          className={styles.avatar}
          src="https://picsum.photos/id/64/200/200"
          mode="aspectFill"
        />
        <View className={styles.profileInfo}>
          <Text className={styles.userName}>海钓达人</Text>
          <Text className={styles.userPhone}>138****8888</Text>
        </View>
      </View>

      <View className={styles.statsRow}>
        {orderMenus.map((item) => (
          <View
            key={item.key}
            className={styles.statItem}
            onClick={() => handleOrderClick(item.key)}
          >
            <View className={styles.badgeWrap}>
              <Text className={styles.statNum}>{item.count}</Text>
            </View>
            <Text className={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>我的服务</Text>
        {serviceMenus.map((item) => (
          <View
            key={item.key}
            className={styles.menuItem}
            onClick={() => handleMenuClick(item.key)}
          >
            <Text className={styles.menuIcon}>{item.icon}</Text>
            <Text className={styles.menuLabel}>{item.label}</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>其他</Text>
        {settingMenus.map((item) => (
          <View
            key={item.key}
            className={styles.menuItem}
            onClick={() => handleMenuClick(item.key)}
          >
            <Text className={styles.menuIcon}>{item.icon}</Text>
            <Text className={styles.menuLabel}>{item.label}</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MinePage;
