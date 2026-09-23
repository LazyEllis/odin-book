import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getHistoryPostsOptions } from "../utils/query-options";
import TimelinePost from "./TimelinePost";

const HistoryPostList = () => {
  const location = useLocation();

  const historyPostsOptions = getHistoryPostsOptions(location.pathname);

  const { isPending, error, data: posts } = useQuery(historyPostsOptions);

  const { queryKey } = historyPostsOptions;

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (posts.length === 0)
    return (
      <div className="mx-auto my-8 flex w-full flex-col items-center px-8">
        <div className="mb-2 min-w-0 text-3xl font-bold">
          {location.pathname === "/history"
            ? "Save posts for later"
            : "Like some posts"}
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          {location.pathname === "/history"
            ? "Bookmark posts to easily find them again in the future."
            : "Tap the heart on any post to show it some love. When you do, it'll show up here."}
        </div>
      </div>
    );

  return posts.map((post) => (
    <TimelinePost post={post} queryKey={queryKey} key={post.id} />
  ));
};

export default HistoryPostList;
