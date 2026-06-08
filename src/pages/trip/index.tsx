import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useTripListStore } from '@/store/trip-list';
import { useScheduleStore } from '@/store/schedules';
import styles from './index.module.scss';

const statusMap: Record<string, string> = {
  upcoming: '即将出发',
  completed: '已完成',
  cancelled: '已取消',
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
  const router = useRouter();
  const tripId = router.params.tripId;
  const trips = useTripListStore((s) => s.trips);
  const cancelTrip = useTripListStore((s) => s.cancelTrip);
  const increaseSeats = useScheduleStore((s) => s.increaseSeats);

  const trip = useMemo(() => {
    if (tripId) return trips.find((t) => t.id === tripId);
    return trips.length > 0 ? trips[0] : null;
  }, [tripId, trips]);

  const handleNavigate = () => {
    if (!trip) return;
    Taro.openLocation({
      latitude: 30.73,
      longitude: 122.45,
      name: trip.meetingPoint,
      address: trip.meetingAddress,
    }).catch((err) => {
      console.error('[Trip] Open location failed:', err);
      Taro.showToast({ title: '打开导航失败', icon: 'none' });
    });
  };

  const handleCancel = () => {
    if (!trip) return;
    Taro.showModal({
      title: '取消行程',
      content: `确定要取消${trip.boatName} ${trip.date}的行程吗？取消后押金将原路退回。`,
      confirmText: '确定取消',
      confirmColor: '#f53f3f',
      success: (res) => {
        if (res.confirm) {
          cancelTrip(trip.id);
          const seatCount = trip.orderType === 'shared' ? trip.personCount : 1;
          if (trip.scheduleId) {
            increaseSeats(trip.scheduleId, seatCount);
          }
          Taro.showToast({ title: '行程已取消', icon: 'success' });
        }
      },
    });
  };

  if (!trip) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🚢</Text>
          <Text className={styles.emptyText}>暂无行程信息</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.statusHeader}>
        <View className={styles.statusRow}>
          <Text className={styles.statusText}>{trip.boatName}</Text>
          <View className={styles.statusBadge}>
            <Text className={styles.statusBadgeText}>{statusMap[trip.status] || '即将出发'}</Text>
          </View>
        </View>
        <View className={styles.tripMeta}>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>日期</Text>
            <Text className={styles.metaValue}>{trip.date}</Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>时间</Text>
            <Text className={styles.metaValue}>{trip.time}</Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>船长</Text>
            <Text className={styles.metaValue}>{trip.captainName}</Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>方式</Text>
            <Text className={styles.metaValue}>
              {trip.orderType === 'whole' ? '整船包船' : `拼位出海（${trip.personCount}人）`}
            </Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabel}>费用</Text>
            <Text className={styles.metaValue}>¥{trip.totalPrice}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>预订人</Text>
        <View className={styles.personRow}>
          <Text className={styles.personName}>{trip.bookerName}</Text>
          <Text className={styles.personPhone}>{trip.bookerPhone}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>集合点</Text>
        <View className={styles.meetingCard}>
          <View className={styles.meetingInfo}>
            <Text className={styles.meetingPoint}>{trip.meetingPoint}</Text>
            <Text className={styles.meetingAddress}>{trip.meetingAddress}</Text>
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
            <Text className={styles.codeText}>{trip.boardingCode}</Text>
          </View>
          <Text className={styles.codeHint}>登船时出示此码</Text>
        </View>
      </View>

      {trip.companions.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>同行人</Text>
          {trip.companions.map((c, idx) => (
            <View key={idx} className={styles.companionRow}>
              <Text className={styles.companionName}>{c.name || `同行人${idx + 1}`}</Text>
              <Text className={styles.companionPhone}>{c.phone || '-'}</Text>
            </View>
          ))}
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>紧急联系人</Text>
        <View className={styles.personRow}>
          <Text className={styles.personName}>{trip.emergencyContact.name}</Text>
          <Text className={styles.personPhone}>{trip.emergencyContact.phone}</Text>
        </View>
        {trip.emergencyContact.relation ? (
          <Text className={styles.relationText}>关系：{trip.emergencyContact.relation}</Text>
        ) : null}
      </View>

      {trip.addOns.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>加购项目</Text>
          {trip.addOns.map((a, idx) => (
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

      {trip.status === 'upcoming' && (
        <View className={styles.cancelSection}>
          <View className={styles.cancelBtn} onClick={handleCancel}>
            <Text className={styles.cancelBtnText}>取消行程</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TripPage;
