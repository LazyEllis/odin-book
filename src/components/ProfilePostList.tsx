import type { FC } from "react";
import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { UserPublic } from "../interfaces/api";
import { pastTense } from "../utils/format";
import { getUserPostsOptions } from "../utils/query-options";
import TimelinePost from "./TimelinePost";

interface IComponentProps {
  user: UserPublic;
  isCurrentUser: boolean;
}

const ProfilePostList: FC<IComponentProps> = ({ user, isCurrentUser }) => {
  const location = useLocation();

  const userPostsOptions = getUserPostsOptions(user.id, location.pathname);

  const { isPending, error, data: posts } = useQuery(userPostsOptions);

  const { queryKey } = userPostsOptions;

  const resource = String(queryKey[queryKey.length - 1]);

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (posts.length === 0)
    return (
      <div className="mx-auto my-8 flex w-full flex-col items-center px-8">
        <div className="mb-2 min-w-0 text-3xl font-bold">
          {isCurrentUser ? "You haven't" : `@${user.username} hasn't`}{" "}
          {pastTense(resource)} yet
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          When {isCurrentUser ? "you" : "they"} do,{" "}
          {isCurrentUser ? "your" : "their"} {resource} will show up here.
        </div>
      </div>
    );

  return posts.map((post) => (
    <TimelinePost post={post} queryKey={queryKey} key={post.id} />
  ));
};

export default ProfilePostList;
