import type { FC } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserPublic } from "../interfaces/api";
import { followUser, unfollowUser } from "../lib/api-client";
import { classNames } from "../utils/format";
import useCurrentUser from "../hooks/useCurrentUser";

interface Props {
  user: UserPublic;
  queryKey: unknown[];
}

const UserCard: FC<Props> = ({ user, queryKey }) => {
  const queryClient = useQueryClient();

  const { data: currentUser } = useCurrentUser();

  const mutation = useMutation({
    mutationFn: user?.connectionStatus.isFollowing ? unfollowUser : followUser,
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (users: UserPublic[]) =>
        users.map((u) =>
          u.id === user.id
            ? {
                ...u,
                _count: {
                  ...u._count,
                  followers: u.connectionStatus.isFollowing
                    ? u._count.followers - 1
                    : u._count.followers + 1,
                },
                connectionStatus: {
                  ...u.connectionStatus,
                  isFollowing: !u.connectionStatus.isFollowing,
                },
              }
            : u,
        ),
      );
    },
  });

  const isCurrentUser = currentUser?.id === user.id;

  const handleFollowToggle = () => {
    mutation.mutate(user.id);
  };

  return (
    <div className="flex bg-white px-4 py-3 text-black hover:bg-black/10 dark:bg-black dark:text-white dark:hover:bg-white/10">
      <Link
        to={`/users/${user.id}`}
        className="mr-2 shrink-0 grow-0 basis-10 justify-start"
      >
        <img src={user.profileImageUrl} alt="" className="rounded-full" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 flex-col">
            <Link
              to={`/users/${user.id}`}
              className="truncate font-bold hover:underline"
            >
              {user.name}
            </Link>
            <Link
              to={`/users/${user.id}`}
              className="truncate text-gray-500 dark:text-gray-400"
            >
              @{user.username}
            </Link>
          </div>
          {!isCurrentUser && (
            <div className="ml-3 shrink-0">
              <button
                onClick={handleFollowToggle}
                disabled={mutation.isPending}
                className={classNames(
                  "inline-flex w-full cursor-pointer items-center justify-center rounded-full px-4 py-2 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 dark:shadow-none",
                  user.connectionStatus.isFollowing
                    ? "group min-w-24.75 bg-white text-black outline-1 outline-offset-1 outline-black hover:text-[#f4212e] hover:outline-[#67070f] dark:bg-black dark:text-white dark:outline-white"
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
            </div>
          )}
        </div>
        <div className="pt-1">{user.description}</div>
      </div>
    </div>
  );
};

export default UserCard;
