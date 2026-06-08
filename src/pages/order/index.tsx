import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { boats } from '@/data/boats';
import { addOnItems } from '@/data/addons';
import { useScheduleStore } from '@/store/schedules';
import { useTripListStore, type TripRecord, type PriceBreakdown } from '@/store/trip-list';
import type { Companion, EmergencyContact, AddOnItem } from '@/types';
import styles from './index.module.scss';

const PHONE_REG = /^1[3-9]\d{9}$/;

const OrderPage: React.FC = () => {
  const router = useRouter();
  const scheduleId = router.params.scheduleId;
  const boatId = router.params.boatId;

  const allSchedules = useScheduleStore((s) => s.schedules);
  const decreaseSeats = useScheduleStore((s) => s.decreaseSeats);
  const addTrip = useTripListStore((s) => s.addTrip);

  const schedule = useMemo(() => {
    if (scheduleId) return allSchedules.find((s) => s.id === scheduleId);
    if (boatId) return allSchedules.find((s) => s.boatId === boatId);
    return allSchedules[0];
  }, [scheduleId, boatId, allSchedules]);

  const boat = useMemo(() => {
    return boats.find((b) => b.id === (schedule?.boatId || boatId)) || boats[0];
  }, [schedule, boatId]);

  const [orderType, setOrderType] = useState<'whole' | 'shared'>('shared');
  const [addOns, setAddOns] = useState<AddOnItem[]>(addOnItems.map((a) => ({ ...a })));
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [bookerName, setBookerName] = useState('');
  const [bookerPhone, setBookerPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: '',
    phone: '',
    relation: '',
  });
  const [validationMsg, setValidationMsg] = useState('');

  const isSoldOut = schedule ? schedule.availableSeats <= 0 : false;

  useEffect(() => {
    if (isSoldOut && orderType === 'shared') {
      setOrderType('whole');
      setCompanions([]);
    }
  }, [isSoldOut]);

  const availableSeats = schedule?.availableSeats ?? boat.capacity;
  const totalSeats = schedule?.totalSeats ?? boat.capacity;

  const personCount = orderType === 'shared' ? (1 + companions.length) : 1;
  const sharedPricePerPerson = schedule?.sharedPrice || boat.sharedPrice;
  const selectedAddOns = addOns.filter((a) => a.selected);
  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const basePrice = orderType === 'whole'
    ? (schedule?.price || boat.price)
    : sharedPricePerPerson * personCount;
  const deposit = Math.round(basePrice * 0.2);
  const totalPrice = basePrice + addOnTotal;
  const canAddCompanion = orderType === 'shared'
    ? (personCount < availableSeats)
    : (personCount < totalSeats);

  const canOrder = orderType === 'whole' ? !isSoldOut : (availableSeats > 0);

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
    if (!canAddCompanion) {
      Taro.showToast({ title: '余位不足，无法继续添加', icon: 'none' });
      return;
    }
    setCompanions((prev) => [...prev, { name: '', phone: '' }]);
  };

  const removeCompanion = (index: number) => {
    setCompanions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOrderTypeChange = (type: 'whole' | 'shared') => {
    if (type === 'shared' && isSoldOut) return;
    if (type === 'shared') {
      const maxCompanions = availableSeats - 1;
      if (companions.length > maxCompanions) {
        setCompanions((prev) => prev.slice(0, Math.max(0, maxCompanions)));
      }
    } else {
      setCompanions([]);
    }
    setOrderType(type);
    setValidationMsg('');
  };

  const validate = (): string => {
    if (isSoldOut) return '该船期已满员，无法预订';
    if (!canOrder) return '该船期已满员，无法预订';
    if (!bookerName.trim()) return '请填写预订人姓名';
    if (!PHONE_REG.test(bookerPhone)) return '请填写正确的预订人手机号（11位）';
    for (let i = 0; i < companions.length; i++) {
      if (!companions[i].name.trim()) return `请填写同行人${i + 1}的姓名`;
      if (!PHONE_REG.test(companions[i].phone)) return `同行人${i + 1}手机号格式不正确`;
    }
    if (!emergencyContact.name.trim()) return '请填写紧急联系人姓名';
    if (!PHONE_REG.test(emergencyContact.phone)) return '请填写正确的紧急联系人手机号';
    return '';
  };

  const handleSubmit = () => {
    const msg = validate();
    if (msg) {
      setValidationMsg(msg);
      Taro.showToast({ title: msg, icon: 'none', duration: 2500 });
      return;
    }
    setValidationMsg('');

    const portMeetingMap: Record<string, { point: string; address: string }> = {
      '嵊泗列岛港': { point: '嵊泗列岛港3号码头', address: '浙江省舟山市嵊泗县菜园镇基湖村' },
      '南澳岛港': { point: '南澳岛渔港码头', address: '广东省汕头市南澳县后宅镇' },
      '大陈岛港': { point: '大陈岛渔港1号码头', address: '浙江省台州市椒江区大陈镇' },
      '涠洲岛港': { point: '涠洲岛西角码头', address: '广西壮族自治区北海市海城区涠洲镇' },
      '万山群岛港': { point: '万山群岛客运码头', address: '广东省珠海市香洲区万山镇' },
      '平潭岛港': { point: '平潭岛澳前码头', address: '福建省福州市平潭县澳前镇' },
      '三亚港': { point: '三亚鸿洲国际游艇码头', address: '海南省三亚市吉阳区榆亚路' },
      '霞浦港': { point: '霞浦三沙渔港码头', address: '福建省宁德市霞浦县三沙镇' },
    };
    const currentPort = schedule?.portName || boat.portName;
    const meeting = portMeetingMap[currentPort] || { point: currentPort + '码头', address: '' };
    const tripId = `T${Date.now()}`;
    const code = `HD${Date.now().toString(36).toUpperCase().slice(-8)}`;
    const sid = schedule?.id || '';
    const isWholeBoat = orderType === 'whole';

    decreaseSeats(sid, isWholeBoat ? 1 : personCount, isWholeBoat);

    const breakdown: PriceBreakdown = {
      boatFee: basePrice,
      addOnFee: addOnTotal,
      deposit,
      total: totalPrice,
    };

    const trip: TripRecord = {
      id: tripId,
      scheduleId: sid,
      boatName: schedule?.boatName || boat.name,
      captainName: boat.captain,
      date: schedule?.date || '',
      time: schedule ? `${schedule.startTime} - ${schedule.endTime}` : '',
      portName: currentPort,
      meetingPoint: meeting.point,
      meetingAddress: meeting.address,
      orderType,
      personCount,
      bookerName: bookerName.trim(),
      bookerPhone: bookerPhone.trim(),
      companions: companions.filter((c) => c.name.trim()),
      emergencyContact,
      addOns: selectedAddOns.map((a) => ({ name: a.name, price: a.price })),
      boardingCode: code,
      priceBreakdown: breakdown,
      totalPrice,
      status: 'pending_payment',
      createdAt: Date.now(),
    };
    addTrip(trip);

    Taro.showToast({ title: '订单已创建', icon: 'success' });
    setTimeout(() => {
      Taro.redirectTo({ url: `/pages/trip/index?tripId=${tripId}` });
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
            {isSoldOut && (
              <Text className={styles.soldOutHint}>该船期已满员，请选择其他日期</Text>
            )}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>预约方式</Text>
        <View className={styles.typeSelector}>
          <View
            className={`${styles.typeOption} ${orderType === 'shared' ? styles.typeOptionActive : ''} ${isSoldOut ? styles.typeDisabled : ''}`}
            onClick={() => !isSoldOut && handleOrderTypeChange('shared')}
          >
            <Text className={`${styles.typeLabel} ${orderType === 'shared' ? styles.typeLabelActive : ''}`}>
              拼位出海
            </Text>
            <Text className={styles.typePrice}>¥{schedule?.sharedPrice || boat.sharedPrice}/人</Text>
            {isSoldOut && <Text className={styles.typeSoldOut}>已满</Text>}
          </View>
          <View
            className={`${styles.typeOption} ${orderType === 'whole' ? styles.typeOptionActive : ''}`}
            onClick={() => handleOrderTypeChange('whole')}
          >
            <Text className={`${styles.typeLabel} ${orderType === 'whole' ? styles.typeLabelActive : ''}`}>
              整船包船
            </Text>
            <Text className={styles.typePrice}>¥{schedule?.price || boat.price}/船</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>预订人信息</Text>
        <View className={styles.formGroup}>
          <Input
            className={styles.formInput}
            placeholder="预订人姓名"
            value={bookerName}
            onInput={(e) => setBookerName(e.detail.value)}
          />
        </View>
        <View className={styles.formGroup}>
          <Input
            className={styles.formInput}
            placeholder="预订人手机号"
            type="number"
            maxlength={11}
            value={bookerPhone}
            onInput={(e) => setBookerPhone(e.detail.value)}
          />
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
              <View className={styles.removeBtn} onClick={() => removeCompanion(index)}>
                移除
              </View>
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
                  placeholder="手机号（11位）"
                  type="number"
                  maxlength={11}
                  value={c.phone}
                  onInput={(e) => updateCompanion(index, 'phone', e.detail.value)}
                />
              </View>
            </View>
          </View>
        ))}
        {orderType === 'shared' && canAddCompanion && (
          <View className={styles.addCompanionBtn} onClick={addCompanion}>
            + 添加同行人
          </View>
        )}
        {orderType === 'shared' && (
          <Text className={styles.seatsHint}>
            预订人1位 + 同行人{companions.length}位 = 共{personCount}位，
            {availableSeats - personCount > 0
              ? `剩余可约${availableSeats - personCount}位`
              : '已约满全部余位'}
          </Text>
        )}
        {orderType === 'whole' && (
          <Text className={styles.seatsHint}>
            整船包船最多载{totalSeats}人
          </Text>
        )}
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
            placeholder="联系人手机号（11位）"
            type="number"
            maxlength={11}
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
              {orderType === 'whole' ? '整船费用' : `拼位费用（${personCount}人）`}
            </Text>
            <Text className={styles.priceRowValue}>
              {orderType === 'whole' ? `¥${basePrice}` : `¥${sharedPricePerPerson} × ${personCount} = ¥${basePrice}`}
            </Text>
          </View>
          {selectedAddOns.map((a) => (
            <View key={a.id} className={styles.priceRow}>
              <Text className={styles.priceRowLabel}>{a.name}</Text>
              <Text className={styles.priceRowValue}>¥{a.price}</Text>
            </View>
          ))}
          <View className={styles.priceRow}>
            <Text className={styles.priceRowLabel}>押金（船费20%）</Text>
            <Text className={styles.priceRowValue}>¥{deposit}</Text>
          </View>
          <View className={styles.totalRow}>
            <Text className={styles.totalLabel}>应付金额</Text>
            <Text className={styles.totalValue}>¥{totalPrice}</Text>
          </View>
        </View>
      </View>

      {validationMsg ? (
        <View className={styles.validationBar}>
          <Text className={styles.validationText}>{validationMsg}</Text>
        </View>
      ) : null}

      <View className={styles.bottomBar}>
        <View className={styles.bottomPriceInfo}>
          <Text className={styles.bottomTotalLabel}>应付</Text>
          <Text className={styles.bottomTotalPrice}>¥{totalPrice}</Text>
        </View>
        <View
          className={`${styles.submitBtn} ${!canOrder ? styles.submitDisabled : ''}`}
          onClick={canOrder ? handleSubmit : undefined}
        >
          {!canOrder ? '已满员' : '提交订单'}
        </View>
      </View>
    </View>
  );
};

export default OrderPage;
