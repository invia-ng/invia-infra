import { getMonth } from 'date-fns';

export const getSlicedDate = new Date().toISOString().slice(0, 10);

export const getMonthName = (date: Date): string => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthName = monthNames[getMonth(date)];

  return monthName;
};
