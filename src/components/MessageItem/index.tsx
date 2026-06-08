import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { Message } from '@/types';
import styles from './index.module.scss';

interface MessageItemProps {
  message: Message;
  onClick?: (id: string) => void;
}

const typeIconMap: Record<string, string> = {
  reschedule: '🕐',
  cancel: '❌',
  group: '👥',
  notice: '📢',
};

const typeLabelMap: Record<string, string> = {
  reschedule: '改期',
  cancel: '取消',
  group: '拼船',
  notice: '通知',
};

const statusLabelMap: Record<string, { text: string; style: string }> = {
  pending: { text: '待处理', style: styles.statusPending },
  accepted: { text: '已接受', style: styles.statusAccepted },
  rejected: { text: '已拒绝', style: styles.statusRejected },
  refunding: { text: '退款中', style: styles.statusRefunding },
  refunded: { text: '已退款', style: styles.statusRefunded },
  grouped: { text: '已成团', style: styles.statusGrouped },
  forming: { text: '拼团中', style: styles.statusForming },
};

const MessageItem: React.FC<MessageItemProps> = ({ message, onClick }) => {
  const statusInfo = message.status ? statusLabelMap[message.status] : null;

  return (
    <View className={styles.item} onClick={() => onClick?.(message.id)}>
      <View className={classnames(styles.iconWrap, styles[message.type])}>
        <Text className={styles.icon}>{typeIconMap[message.type]}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.top}>
          <Text className={styles.title}>{message.title}</Text>
          {!message.read && <View className={styles.dot} />}
        </View>
        <Text className={styles.desc}>{message.content}</Text>
        <View className={styles.bottom}>
          <View className={styles.tagsWrap}>
            <Text className={styles.typeLabel}>{typeLabelMap[message.type]}</Text>
            {statusInfo && (
              <Text className={`${styles.statusTag} ${statusInfo.style}`}>
                {statusInfo.text}
              </Text>
            )}
          </View>
          <Text className={styles.time}>{message.time}</Text>
        </View>
      </View>
    </View>
  );
};

export default MessageItem;
