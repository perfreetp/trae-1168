import React, { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import styles from './index.module.scss';

interface DepositRecord {
  id: string;
  boatName: string;
  amount: number;
  status: 'paid' | 'refunding' | 'refunded';
  date: string;
  orderNo: string;
  refundProgress?: number;
}

interface RefundRecord {
  id: string;
  boatName: string;
  amount: number;
  status: 'refunding' | 'refunded';
  date: string;
  reason: string;
  refundProgress: number;
}

const depositRecords: DepositRecord[] = [
  { id: 'd1', boatName: '海风号', amount: 500, status: 'paid', date: '2026-06-08', orderNo: 'HD20260608001' },
  { id: 'd2', boatName: '蓝鲸号', amount: 800, status: 'refunding', date: '2026-06-05', orderNo: 'HD20260605002', refundProgress: 60 },
  { id: 'd3', boatName: '乘风号', amount: 1000, status: 'refunded', date: '2026-05-20', orderNo: 'HD20260520003', refundProgress: 100 },
];

const refundRecords: RefundRecord[] = [
  { id: 'r1', boatName: '蓝鲸号', amount: 800, status: 'refunding', date: '2026-06-06', reason: '天气原因取消', refundProgress: 60 },
  { id: 'r2', boatName: '乘风号', amount: 1000, status: 'refunded', date: '2026-05-21', reason: '个人原因取消', refundProgress: 100 },
  { id: 'r3', boatName: '碧海号', amount: 300, status: 'refunded', date: '2026-05-15', reason: '台风预警取消', refundProgress: 100 },
];

const statusTextMap: Record<string, string> = {
  paid: '已支付',
  refunding: '退款中',
  refunded: '已退款',
};

const DepositPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'refund'>('deposit');

  return (
    <View className={styles.page}>
      <View className={styles.tabs}>
        <Button
          className={`${styles.tabItem} ${activeTab === 'deposit' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('deposit')}
        >
          押金记录
          {activeTab === 'deposit' && <View className={styles.tabIndicator} />}
        </Button>
        <Button
          className={`${styles.tabItem} ${activeTab === 'refund' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('refund')}
        >
          退款记录
          {activeTab === 'refund' && <View className={styles.tabIndicator} />}
        </Button>
      </View>

      <View className={styles.list}>
        {activeTab === 'deposit' ? (
          depositRecords.length > 0 ? depositRecords.map((item) => (
            <View key={item.id} className={styles.card}>
              <View className={styles.cardTop}>
                <Text className={styles.boatName}>{item.boatName}</Text>
                <Text className={styles.amount}>¥{item.amount}</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.label}>状态</Text>
                <Text className={styles.value}>{statusTextMap[item.status]}</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.label}>订单号</Text>
                <Text className={styles.value}>{item.orderNo}</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.label}>日期</Text>
                <Text className={styles.value}>{item.date}</Text>
              </View>
              {item.status === 'refunding' && (
                <View className={styles.progressSection}>
                  <Text className={styles.progressLabel}>退款进度</Text>
                  <View className={styles.progressTrack}>
                    <View className={styles.progressFill} style={{ width: `${item.refundProgress || 0}%` }} />
                  </View>
                  <Text className={styles.progressText}>处理中 {item.refundProgress}%</Text>
                </View>
              )}
            </View>
          )) : (
            <View className={styles.empty}>
              <Text className={styles.emptyIcon}>💰</Text>
              <Text className={styles.emptyText}>暂无押金记录</Text>
            </View>
          )
        ) : (
          refundRecords.length > 0 ? refundRecords.map((item) => (
            <View key={item.id} className={styles.card}>
              <View className={styles.cardTop}>
                <Text className={styles.boatName}>{item.boatName}</Text>
                <Text className={`${styles.amount} ${styles.amountRefund}`}>¥{item.amount}</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.label}>状态</Text>
                <Text className={styles.value}>{statusTextMap[item.status]}</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.label}>原因</Text>
                <Text className={styles.value}>{item.reason}</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.label}>日期</Text>
                <Text className={styles.value}>{item.date}</Text>
              </View>
              <View className={styles.progressSection}>
                <Text className={styles.progressLabel}>退款进度</Text>
                <View className={styles.progressTrack}>
                  <View className={styles.progressFill} style={{ width: `${item.refundProgress}%` }} />
                </View>
                <Text className={styles.progressText}>
                  {item.status === 'refunded' ? '退款已完成 ✓' : `处理中 ${item.refundProgress}%`}
                </Text>
              </View>
            </View>
          )) : (
            <View className={styles.empty}>
              <Text className={styles.emptyIcon}>💰</Text>
              <Text className={styles.emptyText}>暂无退款记录</Text>
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default DepositPage;
