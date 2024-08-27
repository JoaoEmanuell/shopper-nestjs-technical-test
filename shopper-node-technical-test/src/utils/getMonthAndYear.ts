/**
 * use a date object to get the month and year
 * @param date date object
 * @returns `month:year`
 */
export const getMonthAndYear = (date: Date) => {
  return `${date.getMonth()}:${date.getFullYear()}`;
};
