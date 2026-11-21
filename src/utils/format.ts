import { differenceInSeconds, isThisYear, format } from "date-fns";
import type { ConfirmationAction } from "../interfaces/props";

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

export const formatURL = (url: string) => url.replace(/(^\w+:|^)\/\//, "");

export const getConfirmationContent = (
  action: ConfirmationAction,
  isPinned: boolean = false,
) => {
  if (action === "DELETE")
    return {
      title: "Delete post?",
      message:
        "This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.",
      action: "Delete",
    };
  else if (isPinned)
    return {
      title: "Unpin post from profile?",
      message:
        "This will no longer appear automatically at the top of your profile.",
      action: "Unpin",
    };
  else
    return {
      title: "Pin post to profile?",
      message:
        "This will appear at the top of your profile and replace any previously pinned post.",
      action: "Pin",
    };
};

export const pastTense = (resource: string) => {
  if (resource === "posts") {
    return "posted";
  } else if (resource === "replies") {
    return "replied";
  } else {
    return "reposted";
  }
};

export const continuousTense = (word: string) =>
  word.endsWith("e") ? `${word.slice(0, -1)}ing...` : `${word}ing...`;
