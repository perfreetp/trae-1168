import React, { useState, useMemo } from 'react';
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import ReviewItem from '@/components/ReviewItem';
import { boats } from '@/data/boats';
import { reviews } from '@/data/reviews';
import styles from './index.module.scss';

const BoatDetailPage: React.FC = () => {
  const router = useRouter();
  const boatId = router.params.id || 'b1';
  const [isCollected, setIsCollected] = useState(false);

  const boat = useMemo(() => {
    return boats.find((b) => b.id === boatId) || boats[0];
  }, [boatId]);

  const handleBook = () => {
    Taro.navigateTo({ url: `/pages/order/index?boatId=${boat.id}` });
  };

  return (
    <View className={styles.page}>
      <Swiper className={styles.swiperWrap} indicatorDots autoplay circular>
        {boat.photos.map((photo, idx) => (
          <SwiperItem key={idx}>
            <Image className={styles.swiperImage} src={photo} mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>

      <View className={styles.mainInfo}>
        <Text className={styles.boatName}>{boat.name}</Text>
        <View className={styles.ratingRow}>
          <Text className={styles.ratingIcon}>★</Text>
          <Text className={styles.ratingNum}>{boat.rating}</Text>
          <Text className={styles.reviewCount}>{boat.reviewCount}条评价</Text>
        </View>
        <View className={styles.priceRow}>
          <Text className={styles.priceLabel}>拼位</Text>
          <Text className={styles.priceValue}>¥{boat.sharedPrice}</Text>
          <Text className={styles.priceUnit}>/人</Text>
          <Text className={styles.wholePrice}>整船</Text>
          <Text className={styles.wholePriceValue}>¥{boat.price}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>船长信息</Text>
        <View className={styles.captainCard}>
          <Image className={styles.captainAvatar} src={boat.captainAvatar} mode="aspectFill" />
          <View className={styles.captainInfo}>
            <Text className={styles.captainName}>{boat.captain}</Text>
            <View className={styles.captainMeta}>
              <Text className={styles.captainYears}>{boat.captainYears}年经验</Text>
              <Text className={styles.captainLicense}>{boat.captainLicense}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>船只参数</Text>
        <View className={styles.specsGrid}>
          <View className={styles.specItem}>
            <Text className={styles.specLabel}>船型</Text>
            <Text className={styles.specValue}>{boat.type}</Text>
          </View>
          <View className={styles.specItem}>
            <Text className={styles.specLabel}>载客</Text>
            <Text className={styles.specValue}>{boat.capacity}人</Text>
          </View>
          <View className={styles.specItem}>
            <Text className={styles.specLabel}>船长</Text>
            <Text className={styles.specValue}>{boat.length}米</Text>
          </View>
          <View className={styles.specItem}>
            <Text className={styles.specLabel}>航速</Text>
            <Text className={styles.specValue}>{boat.speed}节</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>船上装备</Text>
        <View className={styles.equipmentList}>
          {boat.equipment.map((eq) => (
            <View key={eq} className={styles.equipmentTag}>
              <Text className={styles.equipmentText}>{eq}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>船只介绍</Text>
        <Text className={styles.desc}>{boat.description}</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>用户评价</Text>
        {reviews.slice(0, 5).map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </View>

      <View className={styles.bottomBar}>
        <View
          className={styles.collectBtn}
          onClick={() => setIsCollected(!isCollected)}
        >
          {isCollected ? '❤️' : '🤍'}
        </View>
        <View className={styles.bookBtn} onClick={handleBook}>
          立即约船
        </View>
      </View>
    </View>
  );
};

export default BoatDetailPage;
