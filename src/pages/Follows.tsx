import { NavLink, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUserOptions } from "../utils/query-options";
import { classNames } from "../utils/format";
import FollowsUserList from "../components/FollowsUserList";

const Follows = () => {
  const { userId } = useParams();

  const userOptions = getUserOptions(Number(userId));

  const { isPending, error, data: user } = useQuery(userOptions);

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <h1 className="sr-only">{user.name}</h1>
      <nav className="flex items-center border-b border-white/20">
        <NavLink
          to={`/users/${userId}/following`}
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
              <div>Following</div>
              {isActive && (
                <div className="bg-primary absolute bottom-0 h-1 w-full min-w-14 self-center rounded-full"></div>
              )}
            </div>
          )}
        </NavLink>
        <NavLink
          to={`/users/${userId}/followers`}
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
              <div>Followers</div>
              {isActive && (
                <div className="bg-primary absolute bottom-0 h-1 w-full min-w-14 self-center rounded-full"></div>
              )}
            </div>
          )}
        </NavLink>
      </nav>
      <div>
        <FollowsUserList />
      </div>
    </>
  );
};

export default Follows;
