import { queryOptions } from "@tanstack/react-query";
import {
  getBookmarks,
  getCurrentUser,
  getCurrentUserLikes,
  getUserPosts,
  getUserReplies,
  getUserReposts,
} from "../lib/api-client";

export const currentUserOptions = queryOptions({
  queryFn: getCurrentUser,
  queryKey: ["users", "me"],
});

export const getUserPostsOptions = (userId: number, path: string) => {
  if (path === `/users/${userId}`) {
    return queryOptions({
      queryKey: ["users", userId, "posts"],
      queryFn: () => getUserPosts(userId),
    });
  } else if (path === `/users/${userId}/replies`) {
    return queryOptions({
      queryKey: ["users", userId, "replies"],
      queryFn: () => getUserReplies(userId),
    });
  } else {
    return queryOptions({
      queryKey: ["users", userId, "reposts"],
      queryFn: () => getUserReposts(userId),
    });
  }
};

export const getHistoryPostsOptions = (path: string) =>
  queryOptions({
    queryKey: ["users", "me", path === "/history" ? "bookmarks" : "likes"],
    queryFn: path === "/history" ? getBookmarks : getCurrentUserLikes,
  });
