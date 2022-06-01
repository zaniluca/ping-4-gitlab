const MONTH_NAMES: Record<number, string> = {
  1: "J",
  2: "F",
  3: "M",
  4: "A",
  5: "M",
  6: "Ja",
  7: "Ju",
  8: "A",
  9: "S",
  10: "O",
  11: "N",
  12: "D",
};

const timeElapsed = (date: Date) => {
  const currentDate = new Date();
  const currentTimeInms = currentDate.getTime();
  const targetTimeInms = date.getTime();
  const elapsed = Math.floor((currentTimeInms - targetTimeInms) / 1000);
  if (elapsed < 30) return "now";
  //< 60 sec
  if (elapsed < 60) return `${elapsed}s`;
  //< 60 minutes
  if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m`;
  //< 24 hours
  if (elapsed < 86400) return `${Math.floor(elapsed / 3600)}h`;
  //<7 days
  if (elapsed < 604800) return `${Math.floor(elapsed / 86400)}d`;
  //<1 month
  if (elapsed < 2628000)
    return `${date.getDate()} ${MONTH_NAMES[date.getMonth() + 1]}`;
  //more than a month
  return date.toLocaleDateString();
};

export default timeElapsed;
