import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useTripListStore } from '@/store/trip-list';
import styles from './index.module.scss';

const tabs = [
  { key: 'upcoming', label: '待出行' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

const statusConfig: Record<string, { text: string; style: string; textStyle: string }> = {
  upcoming: { text: '待出行', style: styles.statusUpcoming, textStyle: styles.statusUpcomingText },
  completed: { text: '已完成', style: styles.statusCompleted, textStyle: styles.statusCompletedText },
  cancelled: { text: '已取消', style: styles.statusCancelled, textStyle: styles.statusCancelledText },
};

const TripListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const trips = useTripListStore((s) => s.trips);

  const filteredTrips = useMemo(() => {
    return trips.filter((t) => t.status === activeTab);
  }, [trips, activeTab]);

  const handleTripClick = (tripId: string) => {
    Taro.navigateTo({ url: `/pages/trip/index?tripId=${tripId}` });
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabs}>
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {activeTab === tab.key && <View className={styles.tabIndicator} />}
          </Button>
        ))}
      </View>

      {filteredTrips.length > 0 ? (
        <ScrollView scrollY className={styles.list}>
          {filteredTrips.map((trip) => {
            const sc = statusConfig[trip.status] || statusConfig.upcoming;
            return (
              <View key={trip.id} className={styles.card} onClick={() => handleTripClick(trip.id)}>
                <View className={styles.cardTop}>
                  <Text className={styles.boatName}>{trip.boatName}</Text>
                  <View className={`${styles.statusBadge} ${sc.style}`}>
                    <Text className={sc.textStyle}>{sc.text}</Text>
                  </View>
                </View>
                <Text className={styles.date}>{trip.date}</Text>
                <Text className={styles.time}>{trip.time}</Text>
                <Text className={styles.port}>{trip.portName}</Text>
                <View className={styles.bottomRow}>
                  <Text className={styles.typeLabel}>
                    {trip.orderType === 'whole' ? '整船包船' : `拼位${trip.personCount}人`}
                  </Text>
                  <Text className={styles.price}>¥{trip.totalPrice}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>🚢</Text>
          <Text className={styles.emptyText}>
            {activeTab === 'upcoming' ? '暂无待出行行程' : activeTab === 'completed' ? '暂无已完成行程' : '暂无已取消行程'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TripListPage;
