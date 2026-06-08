import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useTripListStore, PAY_TIMEOUT_MS, type TripStatus } from '@/store/trip-list';
import { useScheduleStore } from '@/store/schedules';
import styles from './index.module.scss';

const tabs: Array<{ key: TripStatus; label: string }> = [
  { key: 'pending_payment', label: '待支付' },
  { key: 'upcoming', label: '待出行' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

const statusConfig: Record<string, { text: string; style: string; textStyle: string }> = {
  pending_payment: { text: '待支付', style: styles.statusPending, textStyle: styles.statusPendingText },
  upcoming: { text: '待出行', style: styles.statusUpcoming, textStyle: styles.statusUpcomingText },
  completed: { text: '已完成', style: styles.statusCompleted, textStyle: styles.statusCompletedText },
  cancelled: { text: '已取消', style: styles.statusCancelled, textStyle: styles.statusCancelledText },
};

const formatCountdown = (ms: number): string => {
  if (ms <= 0) return '已超时';
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const TripListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TripStatus>('upcoming');
  const [now, setNow] = useState(Date.now());
  const trips = useTripListStore((s) => s.trips);
  const expireTrips = useTripListStore((s) => s.expireTrips);
  const cancelTrip = useTripListStore((s) => s.cancelTrip);
  const increaseSeats = useScheduleStore((s) => s.increaseSeats);

  useEffect(() => {
    const expiredIds = expireTrips();
    if (expiredIds.length > 0) {
      const allTrips = useTripListStore.getState().trips;
      expiredIds.forEach((eid) => {
        const et = allTrips.find((t) => t.id === eid);
        if (et) {
          const isWholeBoat = et.orderType === 'whole';
          const seatCount = isWholeBoat ? 1 : et.personCount;
          if (et.scheduleId) {
            increaseSeats(et.scheduleId, seatCount, isWholeBoat);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredTrips = useMemo(() => {
    return trips
      .filter((t) => t.status === activeTab)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [trips, activeTab]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of trips) {
      counts[t.status] = (counts[t.status] || 0) + 1;
    }
    return counts;
  }, [trips]);

  const handleTripClick = (tripId: string) => {
    Taro.navigateTo({ url: `/pages/trip/index?tripId=${tripId}` });
  };

  const getCountdown = (createdAt: number): string => {
    const remaining = PAY_TIMEOUT_MS - (now - createdAt);
    return formatCountdown(remaining);
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
            {tabCounts[tab.key] ? `(${tabCounts[tab.key]})` : ''}
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
                {trip.status === 'pending_payment' && (
                  <View className={styles.countdownRow}>
                    <Text className={styles.countdownTag}>剩余 {getCountdown(trip.createdAt)}</Text>
                    <Text className={styles.countdownHint}>超时自动取消</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>🚢</Text>
          <Text className={styles.emptyText}>
            {activeTab === 'pending_payment' ? '暂无待支付订单' :
             activeTab === 'upcoming' ? '暂无待出行行程' :
             activeTab === 'completed' ? '暂无已完成行程' : '暂无已取消记录'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TripListPage;
