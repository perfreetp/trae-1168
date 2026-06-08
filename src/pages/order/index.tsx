import React, { useState, useMemo } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { schedules } from '@/data/schedules';
import { boats } from '@/data/boats';
import { addOnItems } from '@/data/addons';
import type { Companion, EmergencyContact, AddOnItem } from '@/types';
import styles from './index.module.scss';

const OrderPage: React.FC = () => {
  const router = useRouter();
  const scheduleId = router.params.scheduleId;
  const boatId = router.params.boatId;

  const schedule = useMemo(() => {
    if (scheduleId) return schedules.find((s) => s.id === scheduleId);
    if (boatId) return schedules.find((s) => s.boatId === boatId);
    return schedules[0];
  }, [scheduleId, boatId]);

  const boat = useMemo(() => {
    return boats.find((b) => b.id === (schedule?.boatId || boatId)) || boats[0];
  }, [schedule, boatId]);

  const [orderType, setOrderType] = useState<'whole' | 'shared'>('shared');
  const [addOns, setAddOns] = useState<AddOnItem[]>(addOnItems.map((a) => ({ ...a })));
  const [companions, setCompanions] = useState<Companion[]>([{ name: '', phone: '' }]);
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: '',
    phone: '',
    relation: '',
  });

  const selectedAddOns = addOns.filter((a) => a.selected);
  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const basePrice = orderType === 'whole' ? (schedule?.price || boat.price) : (schedule?.sharedPrice || boat.sharedPrice);
  const totalPrice = basePrice + addOnTotal;

  const toggleAddOn = (id: string) => {
    setAddOns((prev) =>
      prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a))
    );
  };

  const updateCompanion = (index: number, field: keyof Companion, value: string) => {
    setCompanions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const addCompanion = () => {
    if (companions.length < (schedule?.totalSeats || boat.capacity) - 1) {
      setCompanions((prev) => [...prev, { name: '', phone: '' }]);
    }
  };

  const removeCompanion = (index: number) => {
    setCompanions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!emergencyContact.name || !emergencyContact.phone) {
      Taro.showToast({ title: '请填写紧急联系人', icon: 'none' });
      return;
    }
    console.info('[Order] Submit order:', {
      orderType,
      basePrice,
      addOnTotal,
      totalPrice,
      companions,
      emergencyContact,
    });
    Taro.showToast({ title: '下单成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/trip/index' });
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>船期信息</Text>
        <View className={styles.boatSummary}>
          <View className={styles.boatInfo}>
            <Text className={styles.boatName}>{schedule?.boatName || boat.name}</Text>
            <Text className={styles.boatMeta}>{schedule?.portName || boat.portName}</Text>
            <Text className={styles.boatTime}>
              {schedule?.date} {schedule?.startTime}-{schedule?.endTime}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>预约方式</Text>
        <View className={styles.typeSelector}>
          <View
            className={`${styles.typeOption} ${orderType === 'shared' ? styles.typeOptionActive : ''}`}
            onClick={() => setOrderType('shared')}
          >
            <Text className={`${styles.typeLabel} ${orderType === 'shared' ? styles.typeLabelActive : ''}`}>
              拼位出海
            </Text>
            <Text className={styles.typePrice}>¥{schedule?.sharedPrice || boat.sharedPrice}/人</Text>
          </View>
          <View
            className={`${styles.typeOption} ${orderType === 'whole' ? styles.typeOptionActive : ''}`}
            onClick={() => setOrderType('whole')}
          >
            <Text className={`${styles.typeLabel} ${orderType === 'whole' ? styles.typeLabelActive : ''}`}>
              整船包船
            </Text>
            <Text className={styles.typePrice}>¥{schedule?.price || boat.price}/船</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>加购装备饵料</Text>
        <View className={styles.addonList}>
          {addOns.map((item) => (
            <View key={item.id} className={styles.addonItem} onClick={() => toggleAddOn(item.id)}>
              <View className={styles.addonLeft}>
                <View className={`${styles.addonCheck} ${item.selected ? styles.addonCheckActive : ''}`}>
                  {item.selected ? '✓' : ''}
                </View>
                <Text className={styles.addonName}>{item.name}</Text>
              </View>
              <Text className={styles.addonPrice}>¥{item.price}/{item.unit}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>同行人信息</Text>
        {companions.map((c, index) => (
          <View key={index} className={styles.companionCard}>
            <View className={styles.companionHeader}>
              <Text className={styles.companionTitle}>同行人 {index + 1}</Text>
              {companions.length > 1 && (
                <View className={styles.removeBtn} onClick={() => removeCompanion(index)}>
                  移除
                </View>
              )}
            </View>
            <View className={styles.formRow}>
              <View className={styles.formRowItem}>
                <Input
                  className={styles.formInput}
                  placeholder="姓名"
                  value={c.name}
                  onInput={(e) => updateCompanion(index, 'name', e.detail.value)}
                />
              </View>
              <View className={styles.formRowItem}>
                <Input
                  className={styles.formInput}
                  placeholder="手机号"
                  type="number"
                  value={c.phone}
                  onInput={(e) => updateCompanion(index, 'phone', e.detail.value)}
                />
              </View>
            </View>
          </View>
        ))}
        <View className={styles.addCompanionBtn} onClick={addCompanion}>
          + 添加同行人
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>紧急联系人</Text>
        <View className={styles.formGroup}>
          <Input
            className={styles.formInput}
            placeholder="联系人姓名"
            value={emergencyContact.name}
            onInput={(e) => setEmergencyContact({ ...emergencyContact, name: e.detail.value })}
          />
        </View>
        <View className={styles.formGroup}>
          <Input
            className={styles.formInput}
            placeholder="联系人手机号"
            type="number"
            value={emergencyContact.phone}
            onInput={(e) => setEmergencyContact({ ...emergencyContact, phone: e.detail.value })}
          />
        </View>
        <View className={styles.formGroup}>
          <Input
            className={styles.formInput}
            placeholder="与您的关系（如：配偶、朋友）"
            value={emergencyContact.relation}
            onInput={(e) => setEmergencyContact({ ...emergencyContact, relation: e.detail.value })}
          />
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>费用明细</Text>
        <View className={styles.priceBreakdown}>
          <View className={styles.priceRow}>
            <Text className={styles.priceRowLabel}>
              {orderType === 'whole' ? '整船费用' : '拼位费用'}
            </Text>
            <Text className={styles.priceRowValue}>¥{basePrice}</Text>
          </View>
          {selectedAddOns.map((a) => (
            <View key={a.id} className={styles.priceRow}>
              <Text className={styles.priceRowLabel}>{a.name}</Text>
              <Text className={styles.priceRowValue}>¥{a.price}</Text>
            </View>
          ))}
          <View className={styles.totalRow}>
            <Text className={styles.totalLabel}>合计</Text>
            <Text className={styles.totalValue}>¥{totalPrice}</Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.bottomPriceInfo}>
          <Text className={styles.bottomTotalLabel}>合计</Text>
          <Text className={styles.bottomTotalPrice}>¥{totalPrice}</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          提交订单
        </View>
      </View>
    </View>
  );
};

export default OrderPage;
