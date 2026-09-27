import { useLocation, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  currentUserOptions,
  getUserFollowsOptions,
  getUserOptions,
} from "../utils/query-options";
import UserCard from "./UserCard";

const FollowsUserList = () => {
  const { userId } = useParams();
  const location = useLocation();

  const userFollowsOptions = getUserFollowsOptions(
    Number(userId),
    location.pathname,
  );

  const { data: user } = useQuery(getUserOptions(Number(userId)));
  const { data: currentUser } = useQuery(currentUserOptions);

  const { isPending, error, data: users } = useQuery(userFollowsOptions);

  const { queryKey } = userFollowsOptions;

  const isCurrentUser = user?.id === currentUser?.id;

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (users.length === 0)
    return (
      <div className="mx-auto my-8 flex w-full flex-col items-center px-8">
        <div className="mb-2 min-w-0 text-3xl font-bold">
          {location.pathname === `/users/${userId}/following`
            ? `${isCurrentUser ? "You aren't" : `@${user?.username} isn't`} following anyone`
            : "Looking for followers?"}
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          {location.pathname === `/users/${userId}/following`
            ? `Once ${isCurrentUser ? "you" : "they"} follow accounts, they'll show up here.`
            : "When someone follows this account, they'll show up here. Posting and interacting with others helps boost followers."}
        </div>
      </div>
    );

  return users.map((user) => (
    <UserCard user={user} queryKey={queryKey} key={user.id} />
  ));
};

export default FollowsUserList;
