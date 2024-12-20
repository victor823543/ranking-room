export const to1Dec = (number: number) => Math.round(number * 10) / 10;

// Utility function to get ordinal suffix
export const getOrdinalSuffix = (num: number): string => {
  const j = num % 10,
    k = num % 100;
  if (j === 1 && k !== 11) {
    return num + "st";
  }
  if (j === 2 && k !== 12) {
    return num + "nd";
  }
  if (j === 3 && k !== 13) {
    return num + "rd";
  }
  return num + "th";
};
