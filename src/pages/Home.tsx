import { useQuery } from "@tanstack/react-query";
import { postListOptions } from "../utils/query-options";
import TimelinePost from "../components/TimelinePost";

const Home = () => {
  const { data, isPending, error } = useQuery(postListOptions);
  const { queryKey } = postListOptions;

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
          <TimelinePost post={post} queryKey={queryKey} key={post.id} />
        ))}
      </div>
    </>
  );
};

export default Home;
