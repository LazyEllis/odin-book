import type { FC, MouseEvent } from "react";
import { Link, useNavigate } from "react-router";
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
import type { PostPublic } from "../interfaces/api";
import type { QueryKey } from "../interfaces/props";
import { classNames, formatTimestamp } from "../utils/format";
import { currentUserOptions } from "../utils/query-options";
import {
  bookmarkPost,
  likePost,
  removePostBookmark,
  repostPost,
  unlikePost,
  unrepostPost,
} from "../lib/api-client";
import { usePostForm } from "../hooks/usePostForm";
import { useConfirmationDialog } from "../hooks/useConfirmationDialog";
import Quote from "./Quote";

interface Props {
  post: PostPublic;
  queryKey: QueryKey<PostPublic[]>;
}

const TimelinePost: FC<Props> = ({ post, queryKey }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toggleDelete, togglePin } = useConfirmationDialog();
  const { toggleReply, toggleQuote } = usePostForm();

  const { data: user } = useQuery(currentUserOptions);

  const isPostPinned = user?.pinnedPostId === post.id;

  const repostMutation = useMutation({
    mutationFn: post.interactionStatus.isReposted ? unrepostPost : repostPost,
    onSuccess: () => {
      queryClient.setQueryData(
        queryKey,
        (posts) =>
          posts &&
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
      queryClient.setQueryData(
        queryKey,
        (posts) =>
          posts &&
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
      queryClient.setQueryData(
        queryKey,
        (posts) =>
          posts &&
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

  const handlePostClick = () => navigate(`/posts/${post.id}`);

  const handleLinkClick = (e: MouseEvent) => e.stopPropagation();

  const handleReplyToggle = (e: MouseEvent) => {
    e.stopPropagation();
    toggleReply(post.id);
  };

  const handleRepostToggle = (e: MouseEvent) => {
    e.stopPropagation();
    repostMutation.mutate(post.id);
  };

  const handleQuoteToggle = (e: MouseEvent) => {
    e.stopPropagation();
    toggleQuote(post.id);
  };

  const handleLikeToggle = (e: MouseEvent) => {
    e.stopPropagation();
    likeMutation.mutate(post.id);
  };

  const handleBookmarkToggle = (e: MouseEvent) => {
    e.stopPropagation();
    bookmarkMutation.mutate(post.id);
  };

  const handleDeleteToggle = (e: MouseEvent) => {
    e.stopPropagation();
    toggleDelete(post.id);
  };

  const handlePinToggle = (e: MouseEvent) => {
    e.stopPropagation();
    togglePin(post.id);
  };

  return (
    <div className="border-b border-black/10 dark:border-white/20">
      <article
        onClick={handlePostClick}
        className="flex cursor-pointer px-4 py-3 hover:bg-black/3 dark:hover:bg-white/3"
      >
        <div className="mr-2 shrink-0 grow-0 basis-10 items-center">
          <Link
            aria-hidden
            tabIndex={-1}
            to={`/users/${post.author.id}`}
            onClick={handleLinkClick}
            className="focus-visible:outline-primary block w-fit rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <img
              alt={`@${post.author.username}`}
              src={post.author.profileImageUrl}
              className="size-10 cursor-pointer rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
            />
          </Link>
        </div>
        <div className="min-w-0 flex-1 justify-center">
          <div className="mb-0.5">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <Link
                  to={`/users/${post.author.id}`}
                  onClick={handleLinkClick}
                  className="block truncate font-bold hover:underline"
                >
                  {post.author.name}
                </Link>
                <div className="flex text-gray-500 dark:text-gray-400">
                  <Link
                    className="truncate"
                    to={`/users/${post.author.id}`}
                    onClick={handleLinkClick}
                  >
                    @{post.author.username}
                  </Link>
                  <div className="px-1">·</div>
                  <time dateTime={post.createdAt}>
                    {formatTimestamp(post.createdAt)}
                  </time>
                </div>
              </div>
              <Menu as="div" className="relative ml-2">
                <MenuButton
                  onClick={handleLinkClick}
                  className="group hover:text-bookmark relative block cursor-pointer text-gray-400 dark:text-gray-400"
                >
                  <span className="group-hover:bg-bookmark/10 absolute -inset-2 rounded-full" />
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
                    <button
                      onClick={handlePinToggle}
                      className="flex w-full cursor-pointer items-center px-3 py-1 text-sm/6 font-bold text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden dark:text-white dark:data-focus:bg-white/5"
                    >
                      <MapPinIcon className="mr-3 size-4.75" />
                      {isPostPinned
                        ? "Unpin from profile"
                        : "Pin to your profile"}
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to={`/posts/${post.id}/quotes`}
                      onClick={handleLinkClick}
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
          <div>{post.text}</div>
          {post.quotedPost && <Quote post={post.quotedPost} />}
          <div className="mt-3 flex justify-between gap-x-1">
            <button
              onClick={handleReplyToggle}
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

            <Menu as="div" className="relative self-center">
              <MenuButton
                onClick={handleLinkClick}
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
