const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
});

function formatCompactNumber(number: number) {
  return compactNumberFormatter.format(number);
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'short',
  timeZone: 'UTC',
});

function formatDate(date: Date) {
  return dateFormatter.format(date);
}

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  year: '2-digit',
  month: 'short',
  timeZone: 'UTC',
});

function formatMonth(date: Date) {
  return monthFormatter.format(date);
}

export {
  formatCompactNumber,
  formatDate,
  formatMonth,
};
