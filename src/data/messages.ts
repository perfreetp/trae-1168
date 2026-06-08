import type { Message } from '@/types';

export const messages: Message[] = [
  {
    id: 'm1', type: 'reschedule', title: '船期变更通知',
    content: '海风号6月8日航次因天气原因调整至6月9日出发，请确认是否接受改期。',
    time: '10分钟前', read: false, boatName: '海风号', date: '2026-06-08',
    status: 'pending',
  },
  {
    id: 'm2', type: 'group', title: '拼船成团提醒',
    content: '蓝鲸号6月9日拼船已满员，成团成功！请按时到达集合点。',
    time: '1小时前', read: false, boatName: '蓝鲸号', date: '2026-06-09',
    status: 'grouped', groupTotal: 12, groupCurrent: 12,
  },
  {
    id: 'm3', type: 'cancel', title: '航次取消通知',
    content: '碧海号6月10日航次因台风预警取消，押金将原路退回，请关注退款进度。',
    time: '2小时前', read: true, boatName: '碧海号', date: '2026-06-10',
    status: 'refunding', refundProgress: 60,
  },
  {
    id: 'm4', type: 'notice', title: '船长发来通知',
    content: '乘风号船长提醒：明天气温较高，请做好防晒准备，建议携带遮阳帽和防晒霜。',
    time: '3小时前', read: true, boatName: '乘风号', date: '2026-06-09',
  },
  {
    id: 'm5', type: 'group', title: '拼船成团提醒',
    content: '浪花号6月11日拼船还差2人成团，快邀请好友一起出海吧！',
    time: '5小时前', read: false, boatName: '浪花号', date: '2026-06-11',
    status: 'forming', groupTotal: 8, groupCurrent: 6,
  },
  {
    id: 'm6', type: 'reschedule', title: '船期变更通知',
    content: '鲲鹏号6月12日航次出发时间由05:00调整为05:30，请注意时间变更。',
    time: '昨天', read: true, boatName: '鲲鹏号', date: '2026-06-12',
    status: 'pending',
  },
  {
    id: 'm7', type: 'notice', title: '出海注意事项',
    content: '飞鱼号船长提醒：请穿着防滑鞋，海上风浪较大，注意安全。',
    time: '昨天', read: true, boatName: '飞鱼号', date: '2026-06-10',
  },
  {
    id: 'm8', type: 'cancel', title: '航次取消通知',
    content: '渔乐号6月13日航次因维修保养取消，已为您办理全额退款。',
    time: '2天前', read: true, boatName: '渔乐号', date: '2026-06-13',
    status: 'refunded', refundProgress: 100,
  },
  {
    id: 'm9', type: 'group', title: '拼船成团提醒',
    content: '海鹰号6月14日拼船已满员，成团成功！船长将在出发前1小时发布集合通知。',
    time: '3天前', read: true, boatName: '海鹰号', date: '2026-06-14',
    status: 'grouped', groupTotal: 10, groupCurrent: 10,
  },
  {
    id: 'm10', type: 'notice', title: '行程提醒',
    content: '您预订的星辰号6月15日航次即将出发，请提前30分钟到达集合点。',
    time: '3天前', read: true, boatName: '星辰号', date: '2026-06-15',
  },
];
