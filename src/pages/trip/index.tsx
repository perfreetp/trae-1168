import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const tripData = {
  id: 't1',
  orderId: 'o1',
  boatName: '海风号',
  captainName: '张海明',
  date: '2026-06-09',
  time: '06:00 - 14:00',
  meetingPoint: '嵊泗列岛港3号码头',
  meetingAddress: '浙江省舟山市嵊泗县菜园镇基湖村',
  boardingCode: 'HD20260609',
  status: 'upcoming' as const,
  notes: [
    '请提前30分钟到达集合点，逾期不候',
    '请穿着防滑鞋和防晒服装',
    '晕船者请提前服用晕船药',
    '船上禁止吸烟，请遵守安全规定',
    '如遇恶劣天气，船长有权取消或改期航次',
    '出海期间请听从船长指挥，注意安全',
  ],
  captainNotices: [
    { id: 'n1', content: '明天海况良好，东南风3级，适合出海。请大家做好防晒准备。', time: '2026-06-08 18:00' },
    { id: 'n2', content: '集合点变更：因潮汐原因，改为3号码头集合，请注意查看导航。', time: '2026-06-08 20:30' },
    { id: 'n3', content: '已备好活饵和冰袋，有额外需求的钓友请提前告知。', time: '2026-06-08 21:00' },
  ],
};

const statusMap: Record<string, string> = {
  upcoming: '即将出发',
  ongoing: '出海中',
  completed: '已完成',
};

const TripPage: React.FC = () => {
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
            <Text className={styles.statusBadgeText}>{statusMap[tripData.status]}</Text>
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

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>注意事项</Text>
        <View className={styles.notesList}>
          {tripData.notes.map((note, idx) => (
            <View key={idx} className={styles.noteItem}>
              <View className={styles.noteDot} />
              <Text className={styles.noteText}>{note}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>船长通知</Text>
        {tripData.captainNotices.map((notice) => (
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
