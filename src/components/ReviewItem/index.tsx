import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import type { Review } from '@/types';
import styles from './index.module.scss';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <View className={styles.item}>
      <View className={styles.header}>
        <Image className={styles.avatar} src={review.avatar} mode="aspectFill" />
        <View className={styles.userInfo}>
          <Text className={styles.userName}>{review.userName}</Text>
          <View className={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text
                key={star}
                className={star <= review.rating ? styles.starActive : styles.starInactive}
              >
                ★
              </Text>
            ))}
          </View>
        </View>
        <Text className={styles.date}>{review.date}</Text>
      </View>
      <Text className={styles.content}>{review.content}</Text>
      {review.images.length > 0 && (
        <View className={styles.images}>
          {review.images.map((img, idx) => (
            <Image key={idx} className={styles.reviewImage} src={img} mode="aspectFill" />
          ))}
        </View>
      )}
    </View>
  );
};

export default ReviewItem;
