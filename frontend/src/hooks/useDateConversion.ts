export const useDateConversion = () => {
  const dateConversion = (date?: string) => {
    if (date) {
      const targetDate = new Date(date);

      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;
      const day = targetDate.getDate();

      const formattedDate = `${year}年${month}月${day}日`;

      return formattedDate;
    }
  };
  return { dateConversion };
};
