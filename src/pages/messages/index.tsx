import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import MessageItem from '@/components/MessageItem';
import { messages as defaultMessages } from '@/data/messages';
import type { Message } from '@/types';
import styles from './index.module.scss';

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'reschedule', label: '改期' },
  { key: 'cancel', label: '取消' },
  { key: 'group', label: '拼船' },
];

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [messageList, setMessageList] = useState<Message[]>(defaultMessages);
  const [activeMsg, setActiveMsg] = useState<Message | null>(null);

  const filteredMessages = useMemo(() => {
    if (activeTab === 'all') return messageList;
    return messageList.filter((m) => m.type === activeTab);
  }, [activeTab, messageList]);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessageList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const handleMessageClick = (id: string) => {
    const msg = messageList.find((m) => m.id === id);
    if (!msg) return;
    if (!msg.read) {
      updateMessage(id, { read: true });
    }
    if (msg.type === 'notice') {
      Taro.showToast({ title: '已读', icon: 'none' });
      return;
    }
    setActiveMsg({ ...msg, read: true });
  };

  const handleAcceptReschedule = () => {
    if (!activeMsg) return;
    updateMessage(activeMsg.id, { status: 'accepted', read: true });
    setActiveMsg(null);
    Taro.showToast({ title: '已接受改期', icon: 'success' });
  };

  const handleRejectReschedule = () => {
    if (!activeMsg) return;
    updateMessage(activeMsg.id, { status: 'rejected', read: true });
    setActiveMsg(null);
    Taro.showToast({ title: '已拒绝改期，将为您退款', icon: 'none' });
  };

  const handleCloseDetail = () => {
    setActiveMsg(null);
  };

  const renderDetail = () => {
    if (!activeMsg) return null;

    if (activeMsg.type === 'reschedule') {
      return (
        <View className={styles.detailPanel}>
          <View className={styles.detailHeader}>
            <Text className={styles.detailTitle}>船期变更通知</Text>
            <View className={styles.detailClose} onClick={handleCloseDetail}>
              <Text className={styles.detailCloseText}>✕</Text>
            </View>
          </View>
          <View className={styles.detailBody}>
            <Text className={styles.detailBoat}>{activeMsg.boatName}</Text>
            <Text className={styles.detailContent}>{activeMsg.content}</Text>
            {activeMsg.status === 'pending' ? (
              <View className={styles.detailActions}>
                <View className={styles.acceptBtn} onClick={handleAcceptReschedule}>
                  <Text className={styles.acceptBtnText}>接受改期</Text>
                </View>
                <View className={styles.rejectBtn} onClick={handleRejectReschedule}>
                  <Text className={styles.rejectBtnText}>拒绝改期</Text>
                </View>
              </View>
            ) : (
              <View className={styles.statusTag}>
                <Text className={styles.statusTagText}>
                  {activeMsg.status === 'accepted' ? '已接受' : '已拒绝'}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    if (activeMsg.type === 'cancel') {
      const progress = activeMsg.refundProgress || 0;
      const isRefunded = activeMsg.status === 'refunded';
      return (
        <View className={styles.detailPanel}>
          <View className={styles.detailHeader}>
            <Text className={styles.detailTitle}>航次取消通知</Text>
            <View className={styles.detailClose} onClick={handleCloseDetail}>
              <Text className={styles.detailCloseText}>✕</Text>
            </View>
          </View>
          <View className={styles.detailBody}>
            <Text className={styles.detailBoat}>{activeMsg.boatName}</Text>
            <Text className={styles.detailContent}>{activeMsg.content}</Text>
            <View className={styles.refundSection}>
              <Text className={styles.refundLabel}>退款进度</Text>
              <View className={styles.progressTrack}>
                <View
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </View>
              <Text className={styles.progressText}>
                {isRefunded ? '退款已完成 ✓' : `退款处理中 ${progress}%`}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    if (activeMsg.type === 'group') {
      const isGrouped = activeMsg.status === 'grouped';
      const current = activeMsg.groupCurrent || 0;
      const total = activeMsg.groupTotal || 0;
      const remaining = total - current;
      return (
        <View className={styles.detailPanel}>
          <View className={styles.detailHeader}>
            <Text className={styles.detailTitle}>拼船成团提醒</Text>
            <View className={styles.detailClose} onClick={handleCloseDetail}>
              <Text className={styles.detailCloseText}>✕</Text>
            </View>
          </View>
          <View className={styles.detailBody}>
            <Text className={styles.detailBoat}>{activeMsg.boatName}</Text>
            <Text className={styles.detailContent}>{activeMsg.content}</Text>
            <View className={styles.groupSection}>
              <View className={styles.groupBar}>
                <View
                  className={styles.groupBarFill}
                  style={{ width: `${(current / total) * 100}%` }}
                />
              </View>
              <Text className={styles.groupProgress}>
                {current}/{total}人
              </Text>
            </View>
            <View className={styles.groupStatus}>
              <Text className={isGrouped ? styles.groupSuccess : styles.groupPending}>
                {isGrouped ? '🎉 已成团，请按时到达集合点' : `⏳ 还差${remaining}人成团，快邀请好友吧`}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return null;
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

      {activeMsg && (
        <View className={styles.mask} onClick={handleCloseDetail}>
          <View className={styles.detailWrap} onClick={(e) => e.stopPropagation()}>
            {renderDetail()}
          </View>
        </View>
      )}
    </View>
  );
};

export default MessagesPage;
