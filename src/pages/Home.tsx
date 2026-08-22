import { useQuery } from "@tanstack/react-query";
import { listPosts } from "../lib/api-client";
import TimelinePost from "../components/ui/TimelinePost";

const Home = () => {
  const { data, isPending, error } = useQuery({
    queryFn: listPosts,
    queryKey: ["posts"],
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <h1 className="sr-only">Timeline posts</h1>

      <div>
        {data.map((post) => (
          <TimelinePost post={post} queryKey={["posts"]} key={post.id} />
        ))}
      </div>
    </>
  );
};

export default Home;
