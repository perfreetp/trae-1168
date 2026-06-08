import type { Review } from '@/types';

export const reviews: Review[] = [
  {
    id: 'r1', userId: 'u1', userName: '钓鱼老王', avatar: 'https://picsum.photos/id/64/200/200',
    rating: 5, content: '张船长经验非常丰富，带我们找到了好几个鱼群聚集点，收获满满！船也很干净，装备齐全。',
    date: '2026-06-01', images: ['https://picsum.photos/id/292/300/300', 'https://picsum.photos/id/312/300/300'],
  },
  {
    id: 'r2', userId: 'u2', userName: '海钓达人', avatar: 'https://picsum.photos/id/91/200/200',
    rating: 5, content: '第二次坐蓝鲸号了，每次都不失望。远海体验太棒了，钓到一条大旗鱼！',
    date: '2026-05-28', images: ['https://picsum.photos/id/326/300/300'],
  },
  {
    id: 'r3', userId: 'u3', userName: '小鱼儿', avatar: 'https://picsum.photos/id/177/200/200',
    rating: 4, content: '船很稳，船长很负责，就是那天风浪比较大，有点晕船。整体体验不错。',
    date: '2026-05-25', images: [],
  },
  {
    id: 'r4', userId: 'u4', userName: '渔乐无穷', avatar: 'https://picsum.photos/id/338/200/200',
    rating: 5, content: '豪华钓船果然不一样，有空调客舱太舒服了，船上还能做饭，下次还来！',
    date: '2026-05-20', images: ['https://picsum.photos/id/401/300/300', 'https://picsum.photos/id/431/300/300', 'https://picsum.photos/id/570/300/300'],
  },
  {
    id: 'r5', userId: 'u5', userName: '新手小白', avatar: 'https://picsum.photos/id/1027/200/200',
    rating: 4, content: '第一次海钓体验，船长很有耐心教我，虽然没钓到大鱼但过程很开心。',
    date: '2026-05-18', images: [],
  },
  {
    id: 'r6', userId: 'u6', userName: '老船长', avatar: 'https://picsum.photos/id/64/200/200',
    rating: 5, content: '专业！探鱼器非常精准，直接带我们到鱼群上方，比我自己找鱼点强太多了。',
    date: '2026-05-15', images: ['https://picsum.photos/id/580/300/300'],
  },
  {
    id: 'r7', userId: 'u7', userName: '海风拂面', avatar: 'https://picsum.photos/id/91/200/200',
    rating: 4, content: '性价比很高，拼船认识了很多钓友，大家一起分享渔获很开心。',
    date: '2026-05-12', images: [],
  },
  {
    id: 'r8', userId: 'u8', userName: '钓鱼侠', avatar: 'https://picsum.photos/id/177/200/200',
    rating: 5, content: '万山群岛的海域真的太美了，浪花号船长带我们去了好几个私密钓点，大丰收！',
    date: '2026-05-10', images: ['https://picsum.photos/id/625/300/300', 'https://picsum.photos/id/835/300/300'],
  },
];
