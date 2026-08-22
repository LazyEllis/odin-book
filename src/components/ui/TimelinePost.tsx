import type { FC } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import type { PostPublic } from "../../interfaces/api";
import { formatTimestamp } from "../../utils/format";
import {
  bookmarkPost,
  likePost,
  removePostBookmark,
  repostPost,
  unlikePost,
  unrepostPost,
} from "../../lib/api-client";

interface IComponentProps {
  post: PostPublic;
  queryKey: string[];
}

const TimelinePost: FC<IComponentProps> = ({ post, queryKey }) => {
  const queryClient = useQueryClient();

  const repostMutation = useMutation({
    mutationFn: post.interactionStatus.isReposted ? unrepostPost : repostPost,
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (posts: PostPublic[]) =>
        posts.map((p) =>
          p.id === post.id
            ? {
                ...post,
                _count: {
                  ...post._count,
                  reposts: post.interactionStatus.isReposted
                    ? post._count.reposts - 1
                    : post._count.reposts + 1,
                },
                interactionStatus: {
                  ...post.interactionStatus,
                  isReposted: !post.interactionStatus.isReposted,
                },
              }
            : p,
        ),
      );
    },
  });

  const likeMutation = useMutation({
    mutationFn: post.interactionStatus.isLiked ? unlikePost : likePost,
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (posts: PostPublic[]) =>
        posts.map((p) =>
          p.id === post.id
            ? {
                ...post,
                _count: {
                  ...post._count,
                  likes: post.interactionStatus.isLiked
                    ? post._count.likes - 1
                    : post._count.likes + 1,
                },
                interactionStatus: {
                  ...post.interactionStatus,
                  isLiked: !post.interactionStatus.isLiked,
                },
              }
            : p,
        ),
      );
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: post.interactionStatus.isBookmarked
      ? removePostBookmark
      : bookmarkPost,
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (posts: PostPublic[]) =>
        posts.map((p) =>
          p.id === post.id
            ? {
                ...post,
                _count: {
                  ...post._count,
                  likes: post.interactionStatus.isBookmarked
                    ? post._count.bookmarks - 1
                    : post._count.bookmarks + 1,
                },
                interactionStatus: {
                  ...post.interactionStatus,
                  isBookmarked: !post.interactionStatus.isBookmarked,
                },
              }
            : p,
        ),
      );
    },
  });

  const handleRepostToggle = () => likeMutation.mutate(post.id);

  const handleLikeToggle = () => likeMutation.mutate(post.id);

  const handleBookmarkToggle = () => bookmarkMutation.mutate(post.id);

  return (
    <div className="border-b border-white/10">
      <article className="flex cursor-pointer overflow-hidden px-4 hover:bg-white/3">
        <div className="mr-2 grow-0 basis-10 items-center">
          <Link
            aria-hidden
            tabIndex={-1}
            to={`/users/${post.author.id}`}
            className="focus-visible:outline-curious-blue-400 block w-fit rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <img
              alt=""
              src={post.author.profileImageUrl}
              className="size-10 cursor-pointer rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
            />
          </Link>
        </div>
        <div className="grow basis-0 justify-center pb-3">
          <div className="mb-0.5">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  to={`/users/${post.author.id}`}
                  className="font-bold hover:underline"
                >
                  {post.author.name}
                </Link>
                <div className="text-gray-400">
                  <Link to={`/users/${post.author.id}`}>
                    @{post.author.username}
                  </Link>{" "}
                  · {formatTimestamp(post.createdAt)}
                </div>
              </div>
            </div>
          </div>
          <div>{post.text}</div>
        </div>
      </article>
    </div>
  );
};

export default TimelinePost;
