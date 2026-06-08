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

const MessageItem: React.FC<MessageItemProps> = ({ message, onClick }) => {
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
          <Text className={styles.typeLabel}>{typeLabelMap[message.type]}</Text>
          <Text className={styles.time}>{message.time}</Text>
        </View>
      </View>
    </View>
  );
};

export default MessageItem;
