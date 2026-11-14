import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  BookmarkIcon,
  PencilSquareIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
  MapPinIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import {
  bookmarkPost,
  likePost,
  removePostBookmark,
  repostPost,
  unlikePost,
  unrepostPost,
} from "../lib/api-client";
import { getPostOptions } from "../utils/query-options";
import { classNames } from "../utils/format";
import { usePostForm } from "../hooks/usePostForm";
import PostRepliesList from "../components/PostRepliesList";
import { useConfirmationDialog } from "../hooks/useConfirmationDialog";

const Post = () => {
  const { toggleReply, toggleQuote } = usePostForm();
  const { toggleDelete } = useConfirmationDialog();
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

  const handleReplyToggle = () => toggleReply(Number(postId));

  const handleRepostToggle = () => repostMutation.mutate(Number(postId));

  const handleQuoteToggle = () => toggleQuote(Number(postId));

  const handleLikeToggle = () => likeMutation.mutate(Number(postId));

  const handleBookmarkToggle = () => bookmarkMutation.mutate(Number(postId));

  const handleDeleteToggle = () => toggleDelete(Number(postId));

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <div className="border-b border-black/10 dark:border-white/20">
        <article className="flex flex-col px-4 pt-3">
          <div className="z-2 flex">
            <div className="mr-2 flex shrink-0 basis-10">
              <Link
                tabIndex={-1}
                to={`/users/${post.author.id}`}
                className="focus-visible:outline-primary block w-fit rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <img
                  alt=""
                  src={post.author.profileImageUrl}
                  className="cursor-pointer rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                />
              </Link>
            </div>
            <div className="mb-0.5 flex flex-1 items-start justify-between">
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
              <Menu as="div" className="relative ml-2">
                <MenuButton className="relative block text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-white">
                  <span className="absolute -inset-2.5" />
                  <span className="sr-only">Open options</span>
                  <EllipsisHorizontalIcon
                    aria-hidden="true"
                    className="size-5"
                  />
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-0.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg outline-1 outline-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-neutral-900 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                >
                  <MenuItem>
                    <button
                      onClick={handleDeleteToggle}
                      className="text-danger flex w-full cursor-pointer items-center px-3 py-1 text-sm/6 font-bold data-focus:bg-gray-50 data-focus:outline-hidden dark:data-focus:bg-white/5"
                    >
                      <TrashIcon className="mr-3 size-4.75" />
                      Delete
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="flex w-full cursor-pointer items-center px-3 py-1 text-sm/6 font-bold text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden dark:text-white dark:data-focus:bg-white/5">
                      <MapPinIcon className="mr-3 size-4.75" />
                      Pin to your profile
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to={`/posts/${post.id}/quotes`}
                      className="flex items-center px-3 py-1 text-sm/6 font-bold text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden dark:text-white dark:data-focus:bg-white/5"
                    >
                      <ChartBarSquareIcon className="mr-3 size-4.75" />
                      View post activity
                    </Link>
                  </MenuItem>
                </MenuItems>
              </Menu>
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
            <div>
              <div className="flex h-10 min-h-7.5 justify-between gap-x-1 border-t border-black/10 px-1 dark:border-white/20">
                <button
                  onClick={handleReplyToggle}
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

                <Menu as="div" className="relative self-center">
                  <MenuButton
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
                  </MenuButton>
                  <MenuItems
                    transition
                    className={classNames(
                      "absolute right-0 z-50 mt-0.5 rounded-md bg-white py-2 shadow-lg outline-1 outline-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-neutral-900 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10",
                      post.interactionStatus.isReposted ? "w-38" : "w-32",
                    )}
                  >
                    <MenuItem>
                      <button
                        onClick={handleRepostToggle}
                        disabled={repostMutation.isPending}
                        aria-label={`${post._count.reposts} ${post._count.reposts === 1 ? "repost" : "reposts"}. Repost`}
                        className="flex w-full cursor-pointer items-center px-3 py-1 text-sm/6 font-bold text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden dark:text-white dark:data-focus:bg-white/5"
                      >
                        <ArrowPathRoundedSquareIcon
                          aria-hidden="true"
                          className="mr-3 size-4.75"
                        />
                        {post.interactionStatus.isReposted
                          ? "Undo Repost"
                          : "Repost"}
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleQuoteToggle}
                        className="flex w-full cursor-pointer items-center px-3 py-1 text-sm/6 font-bold text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden dark:text-white dark:data-focus:bg-white/5"
                      >
                        <PencilSquareIcon
                          aria-hidden="true"
                          className="mr-3 size-4.75"
                        />
                        Quote
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>

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
      <PostRepliesList />
    </>
  );
};

export default Post;
