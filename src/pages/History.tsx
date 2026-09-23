import { NavLink } from "react-router";
import { BookmarkIcon, HeartIcon } from "@heroicons/react/24/outline";
import { classNames } from "../utils/format";
import HistoryPostList from "../components/HistoryPostList";

const History = () => (
  <>
    <nav className="flex items-center border-b border-white/20">
      <NavLink
        to="/history"
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
            <BookmarkIcon className="mr-2 size-4.75" />
            <div>Bookmarks</div>
            {isActive && (
              <div className="bg-primary absolute bottom-0 h-1 w-full min-w-14 self-center rounded-full"></div>
            )}
          </div>
        )}
      </NavLink>
      <NavLink
        to="/history/likes"
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
            <HeartIcon className="mr-2 size-4.75" />
            <div>Likes</div>
            {isActive && (
              <div className="bg-primary absolute bottom-0 h-1 w-full min-w-14 self-center rounded-full"></div>
            )}
          </div>
        )}
      </NavLink>
    </nav>
    <div>
      <HistoryPostList />
    </div>
  </>
);

export default History;
