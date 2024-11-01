const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
});

function formatCompactNumber(number: number) {
  return compactNumberFormatter.format(number);
}

export {
  formatCompactNumber,
};
