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
  if (elapsed < 30) {
    return "now";
  }
  if (elapsed < 60) {
    //< 60 sec
    return `${elapsed}s`;
  }
  if (elapsed < 3600) {
    //< 60 minutes
    return `${Math.floor(elapsed / 60)}m`;
  }
  if (elapsed < 86400) {
    //< 24 hours
    return `${Math.floor(elapsed / 3600)}h`;
  }
  if (elapsed < 604800) {
    //<7 days
    return `${Math.floor(elapsed / 86400)}d`;
  }
  if (elapsed < 2628000) {
    //<1 month
    return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
  }

  return `${date.getDate()} ${
    MONTH_NAMES[date.getMonth()]
  } ${date.getFullYear()}`; //more than a month
};

export default timeElapsed;
