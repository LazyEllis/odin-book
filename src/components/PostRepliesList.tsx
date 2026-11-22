import type { FC } from "react";
import type { PostPublic } from "../interfaces/api";
import type { QueryKey } from "../interfaces/props";
import TimelinePost from "./TimelinePost";

interface Props {
  isPending: boolean;
  error: Error | null;
  replies: PostPublic[] | undefined;
  queryKey: QueryKey<PostPublic[]>;
}

const PostRepliesList: FC<Props> = ({
  isPending,
  error,
  replies,
  queryKey,
}) => {
  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return replies?.map((reply) => (
    <TimelinePost post={reply} queryKey={queryKey} key={reply.id} />
  ));
};

export default PostRepliesList;
