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

export const formatTo12HourTime = (date: Date): string => {
  return date
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .toLowerCase();
};

export const formatToCustomDate = (date: Date): string => {
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}, ${day} ${year}`;
};
