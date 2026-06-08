import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useTripStore } from '@/store/trip';
import styles from './index.module.scss';

const statusMap: Record<string, string> = {
  upcoming: '即将出发',
  ongoing: '出海中',
  completed: '已完成',
};

const defaultNotes = [
  '请提前30分钟到达集合点，逾期不候',
  '请穿着防滑鞋和防晒服装',
  '晕船者请提前服用晕船药',
  '船上禁止吸烟，请遵守安全规定',
  '如遇恶劣天气，船长有权取消或改期航次',
  '出海期间请听从船长指挥，注意安全',
];

const defaultNotices = [
  { id: 'n1', content: '出海前一天请注意查看天气预报，做好相应准备。', time: '出发前1天' },
  { id: 'n2', content: '请确认集合点位置，提前规划出行路线。', time: '出发前1天' },
];

const TripPage: React.FC = () => {
  const tripData = useTripStore((s) => s.tripData);

  const handleNavigate = () => {
    Taro.openLocation({
      latitude: 30.73,
      longitude: 122.45,
      name: tripData.meetingPoint,
      address: tripData.meetingAddress,
    }).catch((err) => {
      console.error('[Trip] Open location failed:', err);
      Taro.showToast({ title: '打开导航失败', icon: 'none' });
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.statusHeader}>
        <View className={styles.statusRow}>
          <Text className={styles.statusText}>{tripData.boatName}</Text>
          <View className={styles.statusBadge}>
            <Text className={styles.statusBadgeText}>{statusMap.upcoming}</Text>
          </View>
        </View>
        <View className={styles.tripMeta}>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>日期</Text>
            <Text className={styles.metaValue}>{tripData.date}</Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>时间</Text>
            <Text className={styles.metaValue}>{tripData.time}</Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>船长</Text>
            <Text className={styles.metaValue}>{tripData.captainName}</Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>方式</Text>
            <Text className={styles.metaValue}>
              {tripData.orderType === 'whole' ? '整船包船' : `拼位出海（${tripData.personCount}人）`}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>集合点</Text>
        <View className={styles.meetingCard}>
          <View className={styles.meetingInfo}>
            <Text className={styles.meetingPoint}>{tripData.meetingPoint}</Text>
            <Text className={styles.meetingAddress}>{tripData.meetingAddress}</Text>
          </View>
          <View className={styles.navBtn} onClick={handleNavigate}>
            <Text className={styles.navIcon}>📍</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>登船码</Text>
        <View className={styles.boardingCodeCard}>
          <View className={styles.codeArea}>
            <Text className={styles.codeText}>{tripData.boardingCode}</Text>
          </View>
          <Text className={styles.codeHint}>登船时出示此码</Text>
        </View>
      </View>

      {tripData.companions.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>同行人</Text>
          {tripData.companions.map((c, idx) => (
            <View key={idx} className={styles.companionRow}>
              <Text className={styles.companionName}>{c.name || `同行人${idx + 1}`}</Text>
              <Text className={styles.companionPhone}>{c.phone || '-'}</Text>
            </View>
          ))}
        </View>
      )}

      {tripData.addOns.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>加购项目</Text>
          {tripData.addOns.map((a, idx) => (
            <View key={idx} className={styles.addonRow}>
              <Text className={styles.addonName}>{a.name}</Text>
              <Text className={styles.addonPrice}>¥{a.price}</Text>
            </View>
          ))}
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>注意事项</Text>
        <View className={styles.notesList}>
          {defaultNotes.map((note, idx) => (
            <View key={idx} className={styles.noteItem}>
              <View className={styles.noteDot} />
              <Text className={styles.noteText}>{note}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>船长通知</Text>
        {defaultNotices.map((notice) => (
          <View key={notice.id} className={styles.noticeItem}>
            <Text className={styles.noticeContent}>{notice.content}</Text>
            <Text className={styles.noticeTime}>{notice.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TripPage;
