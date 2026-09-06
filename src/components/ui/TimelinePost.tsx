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
import { classNames, formatTimestamp } from "../../utils/format";
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
                  bookmarks: post.interactionStatus.isBookmarked
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

  const handleRepostToggle = () => repostMutation.mutate(post.id);

  const handleLikeToggle = () => likeMutation.mutate(post.id);

  const handleBookmarkToggle = () => bookmarkMutation.mutate(post.id);

  return (
    <div className="border-b border-black/10 dark:border-white/20">
      <article className="flex cursor-pointer overflow-hidden px-4 py-3 hover:bg-black/3 dark:hover:bg-white/3">
        <div className="mr-2 grow-0 basis-10 items-center">
          <Link
            aria-hidden
            tabIndex={-1}
            to={`/users/${post.author.id}`}
            className="focus-visible:outline-primary block w-fit rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <img
              alt=""
              src={post.author.profileImageUrl}
              className="size-10 cursor-pointer rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
            />
          </Link>
        </div>
        <div className="grow basis-0 justify-center">
          <div className="mb-0.5">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  to={`/users/${post.author.id}`}
                  className="font-bold hover:underline"
                >
                  {post.author.name}
                </Link>
                <div className="text-gray-500 dark:text-gray-400">
                  <Link to={`/users/${post.author.id}`}>
                    @{post.author.username}
                  </Link>{" "}
                  · {formatTimestamp(post.createdAt)}
                </div>
              </div>
            </div>
          </div>
          <div>{post.text}</div>
          <div className="mt-3 flex justify-between gap-x-1">
            <button
              aria-label={`${post._count.replies} ${post._count.replies === 1 ? "reply" : "replies"}. Reply`}
              className="group hover:text-reply flex min-h-5 cursor-pointer justify-center overflow-visible text-gray-500 dark:text-gray-400"
            >
              <div className="flex min-w-0 items-center justify-start wrap-break-word whitespace-nowrap">
                <div className="relative inline-flex">
                  <div className="group-hover:bg-reply/10 absolute inset-0 -m-2 inline-flex rounded-full"></div>
                  <ChatBubbleOvalLeftIcon className="size-4.75 text-current" />
                </div>
                {post._count.replies > 0 && (
                  <div className="inline-flex overflow-hidden pl-1 text-sm">
                    {post._count.replies}
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={handleRepostToggle}
              disabled={repostMutation.isPending}
              aria-label={`${post._count.reposts} ${post._count.reposts === 1 ? "repost" : "reposts"}. Repost`}
              className={classNames(
                "group hover:text-repost flex min-h-5 cursor-pointer justify-center overflow-visible",
                post.interactionStatus.isReposted
                  ? "text-repost"
                  : "text-gray-500 dark:text-gray-400",
              )}
            >
              <div className="flex min-w-0 items-center justify-start wrap-break-word whitespace-nowrap">
                <div className="relative inline-flex">
                  <div className="group-hover:bg-repost/10 absolute inset-0 -m-2 inline-flex rounded-full"></div>
                  <ArrowPathRoundedSquareIcon className="size-4.75" />
                </div>
                {post._count.reposts > 0 && (
                  <div className="inline-flex overflow-hidden pl-1 text-sm">
                    {post._count.reposts}
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={handleLikeToggle}
              disabled={likeMutation.isPending}
              aria-label={`${post._count.likes} ${post._count.likes === 1 ? "like" : "likes"}. Like`}
              className={classNames(
                "group hover:text-like flex min-h-5 cursor-pointer justify-center overflow-visible",
                post.interactionStatus.isLiked
                  ? "text-like"
                  : "text-gray-500 dark:text-gray-400",
              )}
            >
              <div className="flex min-w-0 items-center justify-start wrap-break-word whitespace-nowrap">
                <div className="relative inline-flex">
                  <div className="group-hover:bg-like/10 absolute inset-0 -m-2 inline-flex rounded-full"></div>
                  <HeartIcon
                    className={classNames(
                      "size-4.75",
                      post.interactionStatus.isLiked && "fill-like",
                    )}
                  />
                </div>
                {post._count.likes > 0 && (
                  <div className="inline-flex overflow-hidden pl-1 text-sm">
                    {post._count.likes}
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={handleBookmarkToggle}
              disabled={bookmarkMutation.isPending}
              aria-label={`${post._count.bookmarks} ${post._count.bookmarks === 1 ? "bookmark" : "bookmarks"}. Bookmark`}
              className={classNames(
                "group hover:text-bookmark flex min-h-5 cursor-pointer justify-center overflow-visible",
                post.interactionStatus.isBookmarked
                  ? "text-bookmark"
                  : "text-gray-500 dark:text-gray-400",
              )}
            >
              <div className="flex min-w-0 items-center justify-start wrap-break-word whitespace-nowrap">
                <div className="relative inline-flex">
                  <div className="group-hover:bg-bookmark/10 absolute inset-0 -m-2 inline-flex rounded-full"></div>
                  <BookmarkIcon
                    className={classNames(
                      "size-4.75",
                      post.interactionStatus.isBookmarked && "fill-bookmark",
                    )}
                  />
                </div>
                {post._count.bookmarks > 0 && (
                  <div className="inline-flex overflow-hidden pl-1 text-sm">
                    {post._count.bookmarks}
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default TimelinePost;
