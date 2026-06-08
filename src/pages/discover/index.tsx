import React, { useState } from 'react';
import { View, Text, Input, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import WeatherCard from '@/components/WeatherCard';
import BoatCard from '@/components/BoatCard';
import ScheduleCard from '@/components/ScheduleCard';
import FishTag from '@/components/FishTag';
import { ports } from '@/data/ports';
import { fishSpecies } from '@/data/fish';
import { boats } from '@/data/boats';
import { useScheduleStore } from '@/store/schedules';
import { weatherInfo } from '@/data/weather';
import styles from './index.module.scss';

const DiscoverPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const schedules = useScheduleStore((s) => s.schedules);

  const popularBoats = boats.filter((b) => b.rating >= 4.8).slice(0, 4);
  const popularSchedules = schedules.filter((s) => s.availableSeats > 0).slice(0, 5);

  const handleBoatClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/boat-detail/index?id=${id}` });
  };

  const handleScheduleClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/order/index?scheduleId=${id}` });
  };

  const handleFishClick = (id: string) => {
    console.info('[Discover] Fish clicked:', id);
  };

  const handlePortClick = (id: string) => {
    console.info('[Discover] Port clicked:', id);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <View className={styles.location}>
            <Text className={styles.locationIcon}>📍</Text>
            <Text className={styles.locationText}>舟山</Text>
          </View>
        </View>
        <Text className={styles.headerTitle}>海钓约船</Text>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索港口、鱼种、船只..."
            placeholderStyle="color: rgba(255, 255, 255, 0.6)"
            value={searchValue}
            onInput={(e) => setSearchValue(e.detail.value)}
          />
        </View>
      </View>

      <WeatherCard weather={weatherInfo} />

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>热门港口</Text>
          <Text className={styles.sectionMore}>更多 ›</Text>
        </View>
        <ScrollView scrollX className={styles.portScroll}>
          {ports.map((port) => (
            <View key={port.id} className={styles.portItem} onClick={() => handlePortClick(port.id)}>
              <Image className={styles.portImage} src={port.image} mode="aspectFill" />
              <Text className={styles.portName}>{port.name}</Text>
              <Text className={styles.portLocation}>{port.location}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>鱼种季节</Text>
          <Text className={styles.sectionMore}>更多 ›</Text>
        </View>
        <ScrollView scrollX className={styles.fishScroll}>
          <View className={styles.fishScrollInner}>
            {fishSpecies.map((fish) => (
              <FishTag key={fish.id} fish={fish} onClick={handleFishClick} />
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>热门船只</Text>
          <Text className={styles.sectionMore}>更多 ›</Text>
        </View>
        <View className={styles.scheduleList}>
          {popularBoats.map((boat) => (
            <BoatCard key={boat.id} boat={boat} onClick={handleBoatClick} />
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>近期船期</Text>
          <Text className={styles.sectionMore}>更多 ›</Text>
        </View>
        <View className={styles.scheduleList}>
          {popularSchedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} onClick={handleScheduleClick} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default DiscoverPage;
