import React from 'react';
import { View, Text } from '@tarojs/components';

interface Invoice {
  id: string;
  title: string;
  amount: number;
  type: string;
  status: 'issued' | 'pending';
  date: string;
  orderNo: string;
}

const invoices: Invoice[] = [
  { id: 'i1', title: '海风号拼位出海', amount: 380, type: '电子发票', status: 'issued', date: '2026-06-01', orderNo: 'HD20260601001' },
  { id: 'i2', title: '蓝鲸号拼位出海', amount: 420, type: '电子发票', status: 'issued', date: '2026-05-28', orderNo: 'HD20260528002' },
  { id: 'i3', title: '乘风号整船包船', amount: 5600, type: '电子发票', status: 'pending', date: '2026-05-20', orderNo: 'HD20260520003' },
  { id: 'i4', title: '浪花号拼位出海', amount: 350, type: '电子发票', status: 'pending', date: '2026-06-05', orderNo: 'HD20260605004' },
];

const InvoicePage: React.FC = () => {
  if (invoices.length === 0) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>🧾</Text>
          <Text className={styles.emptyText}>暂无发票</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      {invoices.map((item) => (
        <View key={item.id} className={styles.card}>
          <View className={styles.cardTop}>
            <Text className={styles.title}>{item.title}</Text>
            <View className={`${styles.statusBadge} ${item.status === 'issued' ? styles.statusIssued : styles.statusPending}`}>
              <Text className={`${styles.statusText} ${item.status === 'issued' ? styles.statusIssuedText : styles.statusPendingText}`}>
                {item.status === 'issued' ? '已开具' : '开具中'}
              </Text>
            </View>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.label}>金额</Text>
            <Text className={styles.priceValue}>¥{item.amount}</Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.label}>类型</Text>
            <Text className={styles.value}>{item.type}</Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.label}>订单号</Text>
            <Text className={styles.value}>{item.orderNo}</Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.label}>日期</Text>
            <Text className={styles.value}>{item.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default InvoicePage;
