import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../lib/api-client";
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
      <div>
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
        </div>
      </div>
    </>
  );
};

export default Profile;
