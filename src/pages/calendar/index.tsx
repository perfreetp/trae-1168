import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import ScheduleCard from '@/components/ScheduleCard';
import { useScheduleStore } from '@/store/schedules';
import { generateDateList } from '@/utils';
import styles from './index.module.scss';

const tideFilters = [
  { key: 'all', label: '全部潮汐' },
  { key: 'high', label: '大潮' },
  { key: 'medium', label: '中潮' },
  { key: 'low', label: '小潮' },
];

const CalendarPage: React.FC = () => {
  const dateList = useMemo(() => generateDateList(14), []);
  const [selectedDate, setSelectedDate] = useState(dateList[0].date);
  const [tideFilter, setTideFilter] = useState('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const schedules = useScheduleStore((s) => s.schedules);

  const filteredSchedules = useMemo(() => {
    let result = schedules.filter((s) => s.date === selectedDate);
    if (tideFilter !== 'all') {
      result = result.filter((s) => s.tideLevel === tideFilter);
    }
    if (showAvailableOnly) {
      result = result.filter((s) => s.availableSeats > 0);
    }
    return result;
  }, [selectedDate, tideFilter, showAvailableOnly]);

  const handleScheduleClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/order/index?scheduleId=${id}` });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.monthRow}>
          <Button className={styles.arrowBtn} onClick={() => {}}>‹</Button>
          <Text className={styles.monthText}>2026年6月</Text>
          <Button className={styles.arrowBtn} onClick={() => {}}>›</Button>
        </View>
        <ScrollView scrollX className={styles.dateScroll}>
          {dateList.map((d) => (
            <View
              key={d.date}
              className={`${styles.dateItem} ${selectedDate === d.date ? styles.dateItemActive : ''}`}
              onClick={() => setSelectedDate(d.date)}
            >
              <Text className={`${styles.dateDay} ${selectedDate === d.date ? styles.dateDayActive : ''}`}>
                {d.weekDay}
              </Text>
              <Text className={styles.dateNum}>{d.day}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.filterRow}>
        {tideFilters.map((f) => (
          <Button
            key={f.key}
            className={`${styles.filterBtn} ${tideFilter === f.key ? styles.filterBtnActive : ''}`}
            onClick={() => setTideFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
        <Button
          className={`${styles.filterBtn} ${showAvailableOnly ? styles.filterBtnActive : ''}`}
          onClick={() => setShowAvailableOnly(!showAvailableOnly)}
        >
          有余位
        </Button>
      </View>

      <View className={styles.resultInfo}>
        <Text className={styles.resultCount}>共{filteredSchedules.length}个船期</Text>
        <Text className={styles.sortBtn}>价格排序</Text>
      </View>

      {filteredSchedules.length > 0 ? (
        <ScrollView scrollY className={styles.list}>
          {filteredSchedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} onClick={handleScheduleClick} />
          ))}
        </ScrollView>
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>🎣</Text>
          <Text className={styles.emptyText}>当日暂无船期，换个日期看看吧</Text>
        </View>
      )}
    </View>
  );
};

export default CalendarPage;
