import type { FC } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { PostPublic, UserPublic } from "../interfaces/api";
import { pastTense } from "../utils/format";
import TimelinePost from "./TimelinePost";

interface IComponentProps {
  query: UseQueryResult<NoInfer<PostPublic[]>, Error>;
  queryKey: unknown[];
  user: UserPublic;
  isAuthenticatedUser: boolean;
}

const ProfilePostList: FC<IComponentProps> = ({
  query,
  queryKey,
  user,
  isAuthenticatedUser,
}) => {
  const { isPending, error, data } = query;

  const resource = String(queryKey[queryKey.length - 1]);

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (data.length === 0)
    return (
      <div className="mx-auto my-8 flex w-full flex-col items-center px-8">
        <div className="mb-2 min-w-0 text-3xl font-bold">
          {isAuthenticatedUser ? "You haven't" : `@${user.username} hasn't`}{" "}
          {pastTense(resource)} yet
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          When {isAuthenticatedUser ? "you" : "they"} do,{" "}
          {isAuthenticatedUser ? "your" : "their"} {resource} will show up here.
        </div>
      </div>
    );

  return data.map((post) => (
    <TimelinePost post={post} queryKey={queryKey} key={post.id} />
  ));
};

export default ProfilePostList;
