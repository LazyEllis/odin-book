import type { FC } from "react";
import type { PostReference } from "../interfaces/api";
import { Link } from "react-router";
import { formatTimestamp } from "../utils/format";

interface Props {
  post: PostReference;
}

const Quote: FC<Props> = ({ post }) => (
  <div
    tabIndex={0}
    className="relative mt-3 cursor-pointer overflow-hidden rounded-2xl border border-black/10 transition-colors hover:bg-black/3 focus-visible:outline-2 focus-visible:-outline-offset-2 dark:border-white/20 dark:hover:bg-white/3"
  >
    <Link
      aria-hidden
      tabIndex={-1}
      to={`/posts/${post.id}`}
      className="absolute inset-0"
    ></Link>
    <article className="flex cursor-pointer p-3">
      <div className="min-w-0 flex-1 justify-center">
        <div className="mb-0.5">
          <div className="flex min-w-0 gap-x-1 *:relative">
            <div className="shrink-0 grow-0 basis-6 items-center">
              <Link
                aria-hidden
                tabIndex={-1}
                to={`/users/${post.author.id}`}
                className="focus-visible:outline-primary block w-fit rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <img
                  alt=""
                  src={post.author.profileImageUrl}
                  className="size-6 cursor-pointer rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                />
              </Link>
            </div>
            <Link
              to={`/users/${post.author.id}`}
              className="truncate font-bold hover:underline"
            >
              {post.author.name}
            </Link>
            <Link
              to={`/users/${post.author.id}`}
              className="truncate text-gray-500 dark:text-gray-400"
            >
              @{post.author.username}
            </Link>
            <span className="text-gray-500 dark:text-gray-400">·</span>
            <Link
              to={`/posts/${post.id}`}
              className="text-gray-500 hover:underline dark:text-gray-400"
            >
              <time dateTime={post.createdAt}>
                {formatTimestamp(post.createdAt)}
              </time>
            </Link>
          </div>
        </div>
        <span className="relative">{post.text}</span>
      </div>
    </article>
  </div>
);

export default Quote;
