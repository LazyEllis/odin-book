import {
  getUserPosts,
  getUserReplies,
  getUserReposts,
} from "../lib/api-client";

export const getPostsQueryData = (userId: number, path: string) => {
  if (path === `/users/${userId}`) {
    return {
      queryKey: ["users", userId, "posts"],
      queryFn: () => getUserPosts(userId),
    };
  } else if (path === `/users/${userId}/replies`) {
    return {
      queryKey: ["users", userId, "replies"],
      queryFn: () => getUserReplies(userId),
    };
  } else {
    return {
      queryKey: ["users", userId, "reposts"],
      queryFn: () => getUserReposts(userId),
    };
  }
};
