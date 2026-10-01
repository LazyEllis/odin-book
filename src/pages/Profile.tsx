import { useState } from "react";
import { Link, NavLink, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LinkIcon, MapPinIcon } from "@heroicons/react/24/outline";
import type { UserPublic } from "../interfaces/api";
import { followUser, getUserById, unfollowUser } from "../lib/api-client";
import { classNames, formatURL } from "../utils/format";
import { currentUserOptions } from "../utils/query-options";
import ProfilePostList from "../components/ProfilePostList";
import ProfileEditForm from "../components/ProfileEditForm";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { userId } = useParams();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery(currentUserOptions);
  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ["users", Number(userId)],
    queryFn: () => getUserById(Number(userId)),
  });

  const mutation = useMutation({
    mutationFn: user?.connectionStatus.isFollowing ? unfollowUser : followUser,
    onSuccess: () => {
      queryClient.setQueryData(
        ["users", Number(userId)],
        (user: UserPublic) => ({
          ...user,
          _count: {
            ...user._count,
            followers: user.connectionStatus.isFollowing
              ? user._count.followers - 1
              : user._count.followers + 1,
          },
          connectionStatus: {
            ...user.connectionStatus,
            isFollowing: !user.connectionStatus.isFollowing,
          },
        }),
      );

      queryClient.setQueryData(
        currentUserOptions.queryKey,
        (currentUser) =>
          currentUser && {
            ...currentUser,
            _count: {
              ...currentUser._count,
              following: user?.connectionStatus.isFollowing
                ? currentUser._count.following - 1
                : currentUser._count.following + 1,
            },
          },
      );
    },
  });

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  const handleFollowToggle = () => {
    mutation.mutate(Number(userId));
  };

  const isCurrentUser = currentUser?.id === user?.id;

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <header>
        <div className="cover h-32 w-full bg-gray-300 lg:h-48 dark:bg-gray-700"></div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 flex items-end space-x-5 sm:-mt-16">
            <div className="flex">
              <img
                src={user.profileImageUrl}
                alt=""
                className="size-24 rounded-full bg-gray-800 ring-4 ring-white sm:size-32 dark:ring-black dark:outline-1 dark:-outline-offset-1 dark:outline-white/10"
              />
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-end pb-1">
              <div className="flex flex-row justify-stretch space-x-4">
                {isCurrentUser ? (
                  <button
                    onClick={handleOpen}
                    className="inline-flex cursor-pointer items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-xs outline-1 outline-offset-1 outline-black hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-black dark:text-white dark:shadow-none dark:outline-white dark:hover:bg-white/10"
                  >
                    Edit profile
                  </button>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    disabled={mutation.isPending}
                    className={classNames(
                      "inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-2 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 dark:shadow-none",
                      user.connectionStatus.isFollowing
                        ? "group min-w-26 bg-white text-black outline-1 outline-offset-1 outline-black hover:text-[#f4212e] hover:outline-[#67070f] dark:bg-black dark:text-white dark:outline-white"
                        : "bg-black text-white hover:bg-black/90 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-white/90 dark:focus-visible:outline-white",
                    )}
                  >
                    {user.connectionStatus.isFollowing ? (
                      <>
                        <div className="group-hover:hidden">Following</div>
                        <div className="hidden group-hover:block">Unfollow</div>
                      </>
                    ) : (
                      <>Follow</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold text-black dark:text-white">
              {user.name}
            </h1>
            <div className="text-gray-500 dark:text-gray-400">
              @{user.username}
            </div>
          </div>
          {user.description && (
            <div className="mt-3 text-black dark:text-white">
              {user.description}
            </div>
          )}
          {(user.location || user.description) && (
            <div className="mt-3 flex flex-wrap gap-x-3">
              {user.location && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <MapPinIcon className="mr-1 size-4.75" />
                  <div>{user.location}</div>
                </div>
              )}
              {user.url && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <LinkIcon className="mr-1 size-4.75" />
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    {formatURL(user.url)}
                  </a>
                </div>
              )}
            </div>
          )}
          <div className="mt-3 flex gap-x-3">
            <Link
              to={`/users/${user.id}/following`}
              className="text-black hover:underline dark:text-white"
            >
              <span className="font-bold">{user._count.following}</span>{" "}
              <span className="text-gray-500 dark:text-gray-400">
                Following
              </span>
            </Link>
            <Link
              to={`/users/${user.id}/followers`}
              className="text-black hover:underline dark:text-white"
            >
              <span className="font-bold">{user._count.followers}</span>{" "}
              <span className="text-gray-500 dark:text-gray-400">
                Followers
              </span>
            </Link>
          </div>
          <nav className="mt-4 flex overflow-x-auto border-b border-white/20">
            <NavLink
              to={`/users/${user.id}`}
              end
              className="flex h-13.25 min-w-14 grow flex-col items-center justify-end px-4 hover:bg-black/10 dark:hover:bg-white/10"
            >
              {({ isActive }) => (
                <div
                  className={classNames(
                    "relative flex h-full items-center justify-center py-4",
                    isActive
                      ? "font-bold text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  <div>Posts</div>
                  {isActive && (
                    <div className="bg-primary absolute bottom-0 h-1 w-full min-w-14 self-center rounded-full"></div>
                  )}
                </div>
              )}
            </NavLink>
            <NavLink
              to={`/users/${user.id}/replies`}
              className="flex h-13.25 min-w-14 grow flex-col items-center justify-end px-4 hover:bg-black/10 dark:hover:bg-white/10"
            >
              {({ isActive }) => (
                <div
                  className={classNames(
                    "relative flex h-full items-center justify-center py-4",
                    isActive
                      ? "font-bold text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  <div>Replies</div>
                  {isActive && (
                    <div className="bg-primary absolute bottom-0 h-1 w-full min-w-14 self-center rounded-full"></div>
                  )}
                </div>
              )}
            </NavLink>
            <NavLink
              to={`/users/${user.id}/reposts`}
              className="flex h-13.25 min-w-14 grow flex-col items-center justify-end px-4 hover:bg-black/10 dark:hover:bg-white/10"
            >
              {({ isActive }) => (
                <div
                  className={classNames(
                    "relative flex h-full items-center justify-center py-4",
                    isActive
                      ? "font-bold text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  <div>Reposts</div>
                  {isActive && (
                    <div className="bg-primary absolute bottom-0 h-1 w-full min-w-14 self-center rounded-full"></div>
                  )}
                </div>
              )}
            </NavLink>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ProfilePostList user={user} isCurrentUser={isCurrentUser} />
      </div>

      <ProfileEditForm
        initialData={user}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
};

export default Profile;
