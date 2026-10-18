import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostOptions } from "../utils/query-options";
import { format } from "date-fns";
import { classNames } from "../utils/format";
import {
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import {
  bookmarkPost,
  likePost,
  removePostBookmark,
  repostPost,
  unlikePost,
  unrepostPost,
} from "../lib/api-client";

const Post = () => {
  const { postId } = useParams();
  const queryClient = useQueryClient();

  const postOptions = getPostOptions(Number(postId));

  const { isPending, error, data: post } = useQuery(postOptions);

  const repostMutation = useMutation({
    mutationFn: post?.interactionStatus.isReposted ? unrepostPost : repostPost,
    onSuccess: () => {
      queryClient.setQueryData(postOptions.queryKey, (post) =>
        post
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
          : post,
      );
    },
  });

  const likeMutation = useMutation({
    mutationFn: post?.interactionStatus.isLiked ? unlikePost : likePost,
    onSuccess: () => {
      queryClient.setQueryData(postOptions.queryKey, (post) =>
        post
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
          : post,
      );
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: post?.interactionStatus.isBookmarked
      ? removePostBookmark
      : bookmarkPost,
    onSuccess: () => {
      queryClient.setQueryData(postOptions.queryKey, (post) =>
        post
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
          : post,
      );
    },
  });

  const handleRepostToggle = () => repostMutation.mutate(Number(postId));

  const handleLikeToggle = () => likeMutation.mutate(Number(postId));

  const handleBookmarkToggle = () => bookmarkMutation.mutate(Number(postId));

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <div className="border-b border-black/10 dark:border-white/20">
        <div>
          <article className="flex flex-col overflow-hidden px-4 pt-3">
            <div className="z-2 flex">
              <div className="mr-2 flex shrink-0 items-center">
                <Link
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
              <div className="mb-0.5 flex flex-1 justify-between">
                <div>
                  <Link
                    to={`/users/${post.author.id}`}
                    className="block truncate font-bold hover:underline"
                  >
                    {post.author.name}
                  </Link>
                  <Link
                    className="truncate text-gray-500 dark:text-gray-400"
                    to={`/users/${post.author.id}`}
                  >
                    @{post.author.username}
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className="mt-3">{post.text}</div>
              <div className="my-4">
                <time
                  dateTime={post.createdAt}
                  className="text-gray-500 dark:text-gray-400"
                >
                  {format(post.createdAt, "h:m a")} ·{" "}
                  {format(post.createdAt, "MMM d, y")}
                </time>
              </div>
              <div className="">
                <div className="flex h-10 min-h-7.5 justify-between gap-x-1 border-t border-black/10 px-1 dark:border-white/20">
                  <button
                    aria-label={`${post._count.replies} ${post._count.replies === 1 ? "reply" : "replies"}. Reply`}
                    className="group hover:text-reply flex min-h-5 cursor-pointer justify-center overflow-visible text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex min-w-0 items-center justify-start wrap-break-word whitespace-nowrap">
                      <div className="relative inline-flex">
                        <div className="group-hover:bg-reply/10 absolute inset-0 -m-2 inline-flex rounded-full"></div>
                        <ChatBubbleOvalLeftIcon className="size-5.75 text-current" />
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
                        <ArrowPathRoundedSquareIcon className="size-5.75" />
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
                            "size-5.75",
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
                            "size-5.75",
                            post.interactionStatus.isBookmarked &&
                              "fill-bookmark",
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
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default Post;
