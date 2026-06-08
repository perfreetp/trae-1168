import dayjs from 'dayjs';

export const formatDate = (date: string, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

export const getWeekDay = (date: string): string => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return '周' + days[dayjs(date).day()];
};

export const formatPrice = (price: number): string => {
  return `¥${price}`;
};

export const getSuitabilityText = (level: string): string => {
  const map: Record<string, string> = {
    good: '适宜出海',
    moderate: '谨慎出海',
    poor: '不宜出海'
  };
  return map[level] || level;
};

export const getSuitabilityColor = (level: string): string => {
  const map: Record<string, string> = {
    good: '#00b42a',
    moderate: '#ff7d00',
    poor: '#f53f3f'
  };
  return map[level] || '#8C96A6';
};

export const generateDateList = (days: number = 14): Array<{ date: string; day: string; weekDay: string; isToday: boolean }> => {
  const result = [];
  for (let i = 0; i < days; i++) {
    const d = dayjs().add(i, 'day');
    result.push({
      date: d.format('YYYY-MM-DD'),
      day: d.format('DD'),
      weekDay: i === 0 ? '今天' : getWeekDay(d.format('YYYY-MM-DD')),
      isToday: i === 0
    });
  }
  return result;
};
