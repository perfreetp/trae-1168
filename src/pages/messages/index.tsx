import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import MessageItem from '@/components/MessageItem';
import { messages } from '@/data/messages';
import styles from './index.module.scss';

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'reschedule', label: '改期' },
  { key: 'cancel', label: '取消' },
  { key: 'group', label: '拼船' },
];

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredMessages = useMemo(() => {
    if (activeTab === 'all') return messages;
    return messages.filter((m) => m.type === activeTab);
  }, [activeTab]);

  const unreadCount = useMemo(() => {
    return messages.filter((m) => !m.read).length;
  }, []);

  const handleMessageClick = (id: string) => {
    console.info('[Messages] Message clicked:', id);
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {activeTab === tab.key && <View className={styles.tabIndicator} />}
          </Button>
        ))}
      </View>

      {filteredMessages.length > 0 ? (
        <ScrollView scrollY className={styles.messageList}>
          {filteredMessages.map((msg) => (
            <MessageItem key={msg.id} message={msg} onClick={handleMessageClick} />
          ))}
        </ScrollView>
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>📭</Text>
          <Text className={styles.emptyText}>暂无消息</Text>
        </View>
      )}
    </View>
  );
};

export default MessagesPage;
