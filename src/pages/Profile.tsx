import { Link, NavLink, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { LinkIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { getUserById } from "../lib/api-client";
import { classNames, formatURL } from "../utils/format";
import useProfile from "../hooks/useProfile";

const Profile = () => {
  const { userId } = useParams();

  const profileQuery = useProfile();

  const userQuery = useQuery({
    queryKey: ["users", Number(userId)],
    queryFn: () => getUserById(Number(userId)),
  });

  if (userQuery.isPending || profileQuery.isPending)
    return <div>Loading...</div>;

  if (userQuery.error || profileQuery.error)
    return <div>{userQuery.error?.message || profileQuery.error?.message}</div>;

  const { data: user } = userQuery;

  const isAuthenticatedUser = profileQuery.data.id === user.id;

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
                className="h-24 rounded-full ring-4 ring-white sm:h-32 dark:ring-black dark:outline-1 dark:-outline-offset-1 dark:outline-white/10"
              />
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-end pb-1">
              <div className="flex flex-row justify-stretch space-x-4">
                {isAuthenticatedUser ? (
                  <button className="inline-flex cursor-pointer items-center rounded-full border-black bg-white px-4 py-2 text-sm font-semibold text-black shadow-xs outline-1 outline-offset-1 outline-black hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-black dark:text-white dark:shadow-none dark:outline-white dark:hover:bg-white/10">
                    Edit profile
                  </button>
                ) : (
                  <button className="inline-flex cursor-pointer items-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-white/90 dark:focus-visible:outline-white">
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 min-w-0 flex-1">
            <h1 className="text-truncate text-2xl font-bold text-black dark:text-white">
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
          <nav className="mt-4 flex overflow-x-auto">
            <NavLink
              to={`/users/${user.id}`}
              className="relative flex h-13.25 min-w-14 grow flex-col items-center justify-end px-4 hover:bg-black/10 dark:hover:bg-white/10"
            >
              {({ isActive }) => (
                <>
                  <div
                    className={classNames(
                      "py-4",
                      isActive
                        ? "text-black dark:text-white"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    Posts
                  </div>
                  {isActive && (
                    <div className="bg-primary absolute bottom-0 h-1 min-w-14 self-center rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to={`/users/${user.id}/replies`}
              className="relative flex h-13.25 min-w-14 grow flex-col items-center justify-end px-4 hover:bg-black/10 dark:hover:bg-white/10"
            >
              {({ isActive }) => (
                <>
                  <div
                    className={classNames(
                      "py-4",
                      isActive
                        ? "text-black dark:text-white"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    Replies
                  </div>
                  {isActive && (
                    <div className="bg-primary absolute bottom-0 h-1 min-w-14 self-center rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to={`/users/${user.id}/reposts`}
              className="relative flex h-13.25 min-w-14 grow flex-col items-center justify-end px-4 hover:bg-black/10 dark:hover:bg-white/10"
            >
              {({ isActive }) => (
                <>
                  <div
                    className={classNames(
                      "py-4",
                      isActive
                        ? "text-black dark:text-white"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    Reposts
                  </div>
                  {isActive && (
                    <div className="bg-primary absolute bottom-0 h-1 min-w-14 self-center rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Profile;
