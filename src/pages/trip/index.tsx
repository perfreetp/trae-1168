import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useTripListStore, PAY_TIMEOUT_MS } from '@/store/trip-list';
import { useScheduleStore } from '@/store/schedules';
import styles from './index.module.scss';

const statusMap: Record<string, string> = {
  pending_payment: '待支付',
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

const formatCountdown = (ms: number): string => {
  if (ms <= 0) return '00:00';
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const TripPage: React.FC = () => {
  const router = useRouter();
  const tripId = router.params.tripId;
  const trips = useTripListStore((s) => s.trips);
  const cancelTrip = useTripListStore((s) => s.cancelTrip);
  const payTrip = useTripListStore((s) => s.payTrip);
  const expireTrips = useTripListStore((s) => s.expireTrips);
  const increaseSeats = useScheduleStore((s) => s.increaseSeats);

  const [countdown, setCountdown] = useState('');
  const [expired, setExpired] = useState(false);

  const trip = useMemo(() => {
    if (tripId) return trips.find((t) => t.id === tripId);
    return trips.length > 0 ? trips[0] : null;
  }, [tripId, trips]);

  const isPendingPayment = trip?.status === 'pending_payment';

  const updateCountdown = useCallback(() => {
    if (!trip || trip.status !== 'pending_payment') return;
    const remaining = PAY_TIMEOUT_MS - (Date.now() - trip.createdAt);
    if (remaining <= 0) {
      setCountdown('00:00');
      setExpired(true);
    } else {
      setCountdown(formatCountdown(remaining));
    }
  }, [trip]);

  useEffect(() => {
    const expiredIds = expireTrips();
    if (expiredIds.length > 0) {
      expiredIds.forEach((eid) => {
        const et = trips.find((t) => t.id === eid);
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
    if (!isPendingPayment) return;
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [isPendingPayment, updateCountdown]);

  useEffect(() => {
    if (expired && trip && trip.status === 'pending_payment') {
      cancelTrip(trip.id);
      const isWholeBoat = trip.orderType === 'whole';
      const seatCount = isWholeBoat ? 1 : trip.personCount;
      if (trip.scheduleId) {
        increaseSeats(trip.scheduleId, seatCount, isWholeBoat);
      }
      Taro.showToast({ title: '支付超时，订单已取消', icon: 'none', duration: 2000 });
    }
  }, [expired]);

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

  const handlePay = () => {
    if (!trip) return;
    Taro.showModal({
      title: '确认支付',
      content: `确认支付¥${trip.totalPrice}？支付成功后行程将变为待出行状态。`,
      confirmText: '确认支付',
      confirmColor: '#1A73B5',
      success: (res) => {
        if (res.confirm) {
          payTrip(trip.id);
          Taro.showToast({ title: '支付成功', icon: 'success' });
        }
      },
    });
  };

  const handleCancel = () => {
    if (!trip) return;
    const refundAmount = trip.totalPrice;
    const isPending = trip.status === 'pending_payment';
    const content = isPending
      ? `取消后将释放占座余位，确定取消订单吗？`
      : `取消行程后预计退款¥${refundAmount}，退款将在1-3个工作日原路退回。确定取消吗？`;
    Taro.showModal({
      title: isPending ? '取消订单' : '取消行程',
      content,
      confirmText: '确定取消',
      confirmColor: '#f53f3f',
      success: (res) => {
        if (res.confirm) {
          cancelTrip(trip.id);
          const isWholeBoat = trip.orderType === 'whole';
          const seatCount = isWholeBoat ? 1 : trip.personCount;
          if (trip.scheduleId) {
            increaseSeats(trip.scheduleId, seatCount, isWholeBoat);
          }
          Taro.showToast({ title: isPending ? '订单已取消' : '行程已取消，退款处理中', icon: 'success' });
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

  const renderPriceBreakdown = () => {
    const bd = trip.priceBreakdown;
    if (!bd) return null;
    return (
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>订单金额明细</Text>
        <View className={styles.breakdownList}>
          <View className={styles.breakdownRow}>
            <Text className={styles.breakdownLabel}>
              {trip.orderType === 'whole' ? '整船船费' : `拼位船费（${trip.personCount}人）`}
            </Text>
            <Text className={styles.breakdownValue}>¥{bd.boatFee}</Text>
          </View>
          {trip.addOns.map((a, idx) => (
            <View key={idx} className={styles.breakdownRow}>
              <Text className={styles.breakdownLabel}>{a.name}</Text>
              <Text className={styles.breakdownValue}>¥{a.price}</Text>
            </View>
          ))}
          <View className={styles.breakdownRow}>
            <Text className={styles.breakdownLabel}>加购小计</Text>
            <Text className={styles.breakdownValue}>¥{bd.addOnFee}</Text>
          </View>
          <View className={styles.breakdownRow}>
            <Text className={styles.breakdownLabel}>押金（船费20%）</Text>
            <Text className={styles.breakdownValue}>¥{bd.deposit}</Text>
          </View>
          <View className={styles.breakdownDivider} />
          <View className={styles.breakdownRow}>
            <Text className={styles.breakdownTotalLabel}>应付金额</Text>
            <Text className={styles.breakdownTotalValue}>¥{bd.total}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPendingPaymentUI = () => (
    <View>
      <View className={styles.paymentCountdownCard}>
        <Text className={styles.countdownLabel}>支付剩余时间</Text>
        <Text className={styles.countdownTime}>{countdown}</Text>
        <Text className={styles.countdownHint}>超时未支付将自动取消订单并释放余位</Text>
      </View>

      {renderPriceBreakdown()}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>预订人</Text>
        <View className={styles.personRow}>
          <Text className={styles.personName}>{trip.bookerName}</Text>
          <Text className={styles.personPhone}>{trip.bookerPhone}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>船期信息</Text>
        <View className={styles.tripMeta}>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabelDark}>船名</Text>
            <Text className={styles.metaValueDark}>{trip.boatName}</Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabelDark}>日期</Text>
            <Text className={styles.metaValueDark}>{trip.date}</Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabelDark}>时间</Text>
            <Text className={styles.metaValueDark}>{trip.time}</Text>
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaLabelDark}>方式</Text>
            <Text className={styles.metaValueDark}>
              {trip.orderType === 'whole' ? '整船包船' : `拼位出海（${trip.personCount}人）`}
            </Text>
          </View>
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

      <View className={styles.bottomActions}>
        <View className={styles.cancelOrderBtn} onClick={handleCancel}>
          <Text className={styles.cancelOrderBtnText}>取消订单</Text>
        </View>
        <View className={styles.payBtn} onClick={handlePay}>
          <Text className={styles.payBtnText}>立即支付 ¥{trip.totalPrice}</Text>
        </View>
      </View>
    </View>
  );

  const renderUpcomingUI = () => (
    <View>
      {renderPriceBreakdown()}

      <View className={styles.refundEntry} onClick={handleCancel}>
        <Text className={styles.refundEntryText}>申请退款</Text>
        <Text className={styles.refundEntryHint}>预计退款¥{trip.totalPrice}</Text>
        <Text className={styles.refundEntryArrow}>›</Text>
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

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>预订人</Text>
        <View className={styles.personRow}>
          <Text className={styles.personName}>{trip.bookerName}</Text>
          <Text className={styles.personPhone}>{trip.bookerPhone}</Text>
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
    </View>
  );

  const renderCancelledUI = () => (
    <View>
      {renderPriceBreakdown()}
      {trip.paidAt && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>退款信息</Text>
          <View className={styles.refundCard}>
            <View className={styles.refundRow}>
              <Text className={styles.refundLabel}>退款金额</Text>
              <Text className={styles.refundValue}>¥{trip.totalPrice}</Text>
            </View>
            <View className={styles.refundRow}>
              <Text className={styles.refundLabel}>退款状态</Text>
              <Text className={styles.refundStatus}>退款处理中</Text>
            </View>
            <View className={styles.refundRow}>
              <Text className={styles.refundLabel}>预计到账</Text>
              <Text className={styles.refundHint}>1-3个工作日</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View className={styles.page}>
      <View className={styles.statusHeader}>
        <View className={styles.statusRow}>
          <Text className={styles.statusText}>{trip.boatName}</Text>
          <View className={`${styles.statusBadge} ${trip.status === 'pending_payment' ? styles.statusBadgePending : ''}`}>
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
        </View>
      </View>

      {trip.status === 'pending_payment' && renderPendingPaymentUI()}
      {trip.status === 'upcoming' && renderUpcomingUI()}
      {trip.status === 'completed' && renderUpcomingUI()}
      {trip.status === 'cancelled' && renderCancelledUI()}
    </View>
  );
};

export default TripPage;
