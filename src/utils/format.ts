import { differenceInSeconds, isThisYear, format } from "date-fns";

const ONE_MINUTE = 60;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;

export const formatTimestamp = (timestamp: string) => {
  const now = new Date();

  const seconds = differenceInSeconds(now, timestamp);
  const isWithinYear = isThisYear(timestamp);

  if (seconds < ONE_MINUTE) {
    return `${seconds}s`;
  } else if (seconds < ONE_HOUR) {
    return `${Math.round(seconds / ONE_MINUTE)}m`;
  } else if (seconds < ONE_DAY) {
    return `${Math.round(seconds / ONE_HOUR)}h`;
  } else if (seconds < ONE_WEEK) {
    return `${Math.round(seconds / ONE_DAY)}d`;
  } else if (isWithinYear) {
    return format(timestamp, "MMM d");
  } else {
    return format(timestamp, "MMM d, y");
  }
};

export const classNames = (...classes: (string | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};
