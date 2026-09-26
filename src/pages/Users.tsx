import { useQuery } from "@tanstack/react-query";
import { listUsers } from "../lib/api-client";
import UserCard from "../components/UserCard";

const Users = () => {
  const {
    isPending,
    error,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
  });

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <header className="px-4 py-3">
        <h1 className="text-xl font-bold">Follow</h1>
      </header>
      <div>
        {users.map((user) => (
          <UserCard user={user} queryKey={["users"]} key={user.id} />
        ))}
      </div>
    </>
  );
};

export default Users;
