import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getRepliesOptions } from "../utils/query-options";
import TimelinePost from "./TimelinePost";

const PostRepliesList = () => {
  const { postId } = useParams();

  const repliesOptions = getRepliesOptions(Number(postId));

  const { isPending, error, data: replies } = useQuery(repliesOptions);

  const { queryKey } = repliesOptions;

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return replies.map((reply) => (
    <TimelinePost post={reply} queryKey={queryKey} key={reply.id} />
  ));
};

export default PostRepliesList;
