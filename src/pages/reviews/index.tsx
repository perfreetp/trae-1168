import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface MyReview {
  id: string;
  boatName: string;
  date: string;
  rating: number;
  content: string;
  images: string[];
}

const initialReviews: MyReview[] = [
  {
    id: 'r1', boatName: '海风号', date: '2026-06-01', rating: 5,
    content: '张船长经验非常丰富，带我们找到了好几个鱼群聚集点，收获满满！船也很干净，装备齐全。',
    images: ['https://picsum.photos/id/292/300/300', 'https://picsum.photos/id/312/300/300'],
  },
  {
    id: 'r2', boatName: '蓝鲸号', date: '2026-05-28', rating: 5,
    content: '第二次坐蓝鲸号了，每次都不失望。远海体验太棒了，钓到一条大旗鱼！',
    images: ['https://picsum.photos/id/326/300/300'],
  },
  {
    id: 'r3', boatName: '乘风号', date: '2026-05-20', rating: 4,
    content: '豪华钓船果然不一样，有空调客舱太舒服了，船上还能做饭。',
    images: [],
  },
];

const ReviewsPage: React.FC = () => {
  const [list, setList] = useState<MyReview[]>(initialReviews);

  const handleDelete = (id: string) => {
    setList((prev) => prev.filter((item) => item.id !== id));
    Taro.showToast({ title: '已删除评价', icon: 'none' });
  };

  if (list.length === 0) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>⭐</Text>
          <Text className={styles.emptyText}>暂无评价</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      {list.map((item) => (
        <View key={item.id} className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.boatName}>{item.boatName}</Text>
            <Text className={styles.date}>{item.date}</Text>
          </View>
          <View className={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} className={star <= item.rating ? styles.starActive : styles.starInactive}>★</Text>
            ))}
          </View>
          <Text className={styles.content}>{item.content}</Text>
          {item.images.length > 0 && (
            <View className={styles.images}>
              {item.images.map((img, idx) => (
                <Image key={idx} className={styles.reviewImage} src={img} mode="aspectFill" />
              ))}
            </View>
          )}
          <View className={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
            <Text className={styles.deleteBtnText}>删除评价</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ReviewsPage;
