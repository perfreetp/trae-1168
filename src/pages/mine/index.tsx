import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const serviceMenus = [
  { key: 'trips', label: '我的行程', icon: '🚢', page: '/pages/trip-list/index' },
  { key: 'favorites', label: '我的收藏', icon: '❤️', page: '/pages/favorites/index' },
  { key: 'reviews', label: '我的评价', icon: '⭐', page: '/pages/reviews/index' },
  { key: 'invoice', label: '发票管理', icon: '🧾', page: '/pages/invoice/index' },
  { key: 'deposit', label: '押金/退款', icon: '💰', page: '/pages/deposit/index' },
  { key: 'blacklist', label: '黑名单船只', icon: '🚫', page: '/pages/blacklist/index' },
];

const settingMenus = [
  { key: 'settings', label: '设置', icon: '⚙️' },
  { key: 'about', label: '关于我们', icon: 'ℹ️' },
  { key: 'help', label: '帮助中心', icon: '❓' },
];

const MinePage: React.FC = () => {
  const handleMenuClick = (key: string, page?: string) => {
    if (page) {
      Taro.navigateTo({ url: page });
    } else {
      console.info('[Mine] Menu clicked:', key);
    }
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

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>我的服务</Text>
        {serviceMenus.map((item) => (
          <View
            key={item.key}
            className={styles.menuItem}
            onClick={() => handleMenuClick(item.key, item.page)}
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
