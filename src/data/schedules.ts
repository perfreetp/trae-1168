import type { Schedule } from '@/types';
import dayjs from 'dayjs';

const today = dayjs().format('YYYY-MM-DD');
const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
const day3 = dayjs().add(2, 'day').format('YYYY-MM-DD');
const day4 = dayjs().add(3, 'day').format('YYYY-MM-DD');
const day5 = dayjs().add(4, 'day').format('YYYY-MM-DD');

export const schedules: Schedule[] = [
  {
    id: 's1', boatId: 'b1', boatName: '海风号', boatType: '休闲钓鱼艇', portName: '嵊泗列岛港',
    date: today, startTime: '06:00', endTime: '14:00', tide: '大潮', tideLevel: 'high',
    totalSeats: 8, availableSeats: 3, price: 2800, sharedPrice: 380,
    fishTypes: ['黄鳍金枪鱼', '石斑鱼', '鲈鱼'], image: 'https://picsum.photos/id/1015/300/300',
  },
  {
    id: 's2', boatId: 'b2', boatName: '蓝鲸号', boatType: '远海钓船', portName: '南澳岛港',
    date: today, startTime: '05:00', endTime: '17:00', tide: '大潮', tideLevel: 'high',
    totalSeats: 12, availableSeats: 5, price: 4200, sharedPrice: 420,
    fishTypes: ['旗鱼', '黄鳍金枪鱼', '马鲛鱼'], image: 'https://picsum.photos/id/1039/300/300',
  },
  {
    id: 's3', boatId: 'b3', boatName: '渔乐号', boatType: '近海钓鱼艇', portName: '大陈岛港',
    date: tomorrow, startTime: '07:00', endTime: '13:00', tide: '中潮', tideLevel: 'medium',
    totalSeats: 6, availableSeats: 2, price: 1800, sharedPrice: 320,
    fishTypes: ['石斑鱼', '黑鲷'], image: 'https://picsum.photos/id/1018/300/300',
  },
  {
    id: 's4', boatId: 'b4', boatName: '乘风号', boatType: '豪华钓船', portName: '三亚港',
    date: tomorrow, startTime: '06:30', endTime: '16:30', tide: '大潮', tideLevel: 'high',
    totalSeats: 10, availableSeats: 0, price: 5600, sharedPrice: 580,
    fishTypes: ['黄鳍金枪鱼', '旗鱼', '红鲷鱼'], image: 'https://picsum.photos/id/1044/300/300',
  },
  {
    id: 's5', boatId: 'b5', boatName: '浪花号', boatType: '近海钓鱼艇', portName: '万山群岛港',
    date: day3, startTime: '06:00', endTime: '14:00', tide: '小潮', tideLevel: 'low',
    totalSeats: 8, availableSeats: 6, price: 2400, sharedPrice: 350,
    fishTypes: ['鲈鱼', '马鲛鱼'], image: 'https://picsum.photos/id/1036/300/300',
  },
  {
    id: 's6', boatId: 'b6', boatName: '碧海号', boatType: '休闲钓鱼艇', portName: '涠洲岛港',
    date: day3, startTime: '07:30', endTime: '12:30', tide: '中潮', tideLevel: 'medium',
    totalSeats: 6, availableSeats: 4, price: 1600, sharedPrice: 280,
    fishTypes: ['海鲈', '石斑鱼'], image: 'https://picsum.photos/id/1015/300/300',
  },
  {
    id: 's7', boatId: 'b7', boatName: '鲲鹏号', boatType: '远海钓船', portName: '嵊泗列岛港',
    date: day4, startTime: '04:30', endTime: '18:00', tide: '大潮', tideLevel: 'high',
    totalSeats: 14, availableSeats: 8, price: 6800, sharedPrice: 520,
    fishTypes: ['黄鳍金枪鱼', '旗鱼', '马鲛鱼', '红鲷鱼'], image: 'https://picsum.photos/id/1039/300/300',
  },
  {
    id: 's8', boatId: 'b8', boatName: '飞鱼号', boatType: '快艇钓船', portName: '平潭岛港',
    date: day4, startTime: '08:00', endTime: '12:00', tide: '小潮', tideLevel: 'low',
    totalSeats: 4, availableSeats: 1, price: 1200, sharedPrice: 320,
    fishTypes: ['鲈鱼', '黑鲷'], image: 'https://picsum.photos/id/1018/300/300',
  },
  {
    id: 's9', boatId: 'b9', boatName: '海鹰号', boatType: '专业钓船', portName: '霞浦港',
    date: day5, startTime: '05:30', endTime: '15:30', tide: '中潮', tideLevel: 'medium',
    totalSeats: 10, availableSeats: 7, price: 3800, sharedPrice: 400,
    fishTypes: ['石斑鱼', '红鲷鱼', '海鲈'], image: 'https://picsum.photos/id/1044/300/300',
  },
  {
    id: 's10', boatId: 'b10', boatName: '星辰号', boatType: '豪华钓船', portName: '南澳岛港',
    date: day5, startTime: '06:00', endTime: '16:00', tide: '大潮', tideLevel: 'high',
    totalSeats: 12, availableSeats: 10, price: 4800, sharedPrice: 450,
    fishTypes: ['黄鳍金枪鱼', '旗鱼', '马鲛鱼', '红鲷鱼'], image: 'https://picsum.photos/id/1036/300/300',
  },
];
