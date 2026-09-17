import type { FC } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { PostPublic } from "../../interfaces/api";
import TimelinePost from "./TimelinePost";

interface IComponentProps {
  query: UseQueryResult<NoInfer<PostPublic[]>, Error>;
  queryKey: unknown[];
}

const ProfilePostList: FC<IComponentProps> = ({ query, queryKey }) => {
  const { isPending, error, data } = query;

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return data.map((post) => (
    <TimelinePost post={post} queryKey={queryKey} key={post.id} />
  ));
};

export default ProfilePostList;
