import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  ArrowRightEndOnRectangleIcon,
  BookmarkIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon as HomeSolidIcon } from "@heroicons/react/24/solid";
import { currentUserOptions } from "../utils/query-options";
import { classNames } from "../utils/format";
import useAuth from "../hooks/useAuth";
import Logo from "./Logo";
import PostForm from "./PostForm";

const AppLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { error, data: user } = useQuery(currentUserOptions);
  const { logout } = useAuth();

  const handleMenuOpen = () => setIsMenuOpen(true);

  const handleMenuClose = () => setIsMenuOpen(false);

  const handleModalOpen = () => setIsModalOpen(true);

  const handleModalClose = () => setIsModalOpen(false);

  useEffect(() => {
    if (error?.message === "Unauthorized") {
      logout();
    }
  }, [error?.message, logout]);

  if (!user) return <Logo className="absolute inset-0 m-auto size-18" />;

  return (
    <div className="flex h-full flex-col">
      <header className="mx-auto flex h-13.25 w-full flex-row items-center justify-between border-b border-black/10 px-4 dark:border-white/20">
        <button
          onClick={handleMenuOpen}
          className="focus-visible:outline-primary relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="sr-only">Open user menu</span>
          <img
            alt=""
            src={user.profileImageUrl}
            className="size-8 cursor-pointer rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
          />
        </button>
        <div className="flex shrink-0 items-center">
          <span className="sr-only">Chirp</span>
          <Logo className="size-8" />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>

      <aside aria-label="Compose a post" className="relative flex flex-col">
        <div className="relative top-[calc(env(safe-area-inset-bottom)-53-20px)] right-5 bottom-5 self-end">
          <button
            onClick={handleModalOpen}
            className="bg-bookmark hover:bg-bookmark/90 flex size-14 cursor-pointer items-center justify-center rounded-full shadow-xs"
          >
            <span className="sr-only">Compose a post</span>
            <PencilSquareIcon className="size-6 text-white" />
          </button>
          <PostForm isOpen={isModalOpen} onClose={handleModalClose} />
        </div>
      </aside>

      <nav
        className="flex h-14 max-h-[16vh] flex-row border-t border-black/10 dark:border-white/20"
        aria-label="primary"
      >
        <NavLink
          to="/"
          className="flex grow flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <div className="rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10">
              <span className="sr-only">Home</span>
              {isActive ? (
                <HomeSolidIcon className="inline-block size-7 max-w-full" />
              ) : (
                <HomeIcon className="inline-block size-7 max-w-full" />
              )}
            </div>
          )}
        </NavLink>
        <NavLink
          to="/explore"
          className="flex grow flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <div className="rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10">
              <span className="sr-only">Explore</span>
              <MagnifyingGlassIcon
                className={classNames(
                  "inline-block size-7 max-w-full",
                  isActive && "stroke-[2.6]",
                )}
              />
            </div>
          )}
        </NavLink>
        <NavLink
          to={`/users/${user.id}`}
          className="flex grow flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <div className="rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10">
              <span className="sr-only">Profile</span>
              <UserIcon
                className={classNames(
                  "inline-block size-7 max-w-full",
                  isActive && "fill-current",
                )}
              />
            </div>
          )}
        </NavLink>
        <NavLink
          to="/history"
          className="flex grow flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <div className="rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10">
              <span className="sr-only">History</span>
              <BookmarkIcon
                className={classNames(
                  "inline-block size-7 max-w-full",
                  isActive && "fill-current",
                )}
              />
            </div>
          )}
        </NavLink>
        <button
          onClick={logout}
          className="flex grow cursor-pointer flex-col items-center justify-center"
        >
          <div className="rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10">
            <span className="sr-only">Log out</span>
            <ArrowRightEndOnRectangleIcon className="inline-block size-7 max-w-full" />
          </div>
        </button>
      </nav>

      <Dialog
        open={isMenuOpen}
        onClose={handleMenuClose}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0 dark:bg-gray-900/50"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10 sm:pr-16">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:-translate-x-full sm:duration-700"
              >
                <TransitionChild>
                  <div className="absolute top-0 right-0 -mr-8 flex pt-4 pl-2 duration-500 ease-in-out data-closed:opacity-0 sm:-mr-10 sm:pl-4">
                    <button
                      type="button"
                      onClick={handleMenuClose}
                      className="focus-visible:outline-primary relative rounded-md text-gray-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-gray-400 dark:hover:text-white"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>
                </TransitionChild>
                <div className="relative flex h-full flex-col overflow-y-auto bg-white py-4 shadow-xl dark:bg-black dark:after:absolute dark:after:inset-y-0 dark:after:left-0 dark:after:w-px dark:after:bg-white/10">
                  <div className="px-4">
                    <div className="mb-2">
                      <Link
                        to={`/users/${user.id}`}
                        className="focus-visible:outline-primary block w-fit rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <span className="sr-only">Open user profile</span>
                        <img
                          alt=""
                          src={user.profileImageUrl}
                          className="size-8 cursor-pointer rounded-full bg-black outline -outline-offset-1 outline-white/10"
                        />
                      </Link>
                    </div>
                    <div className="mb-3">
                      <Link
                        to={`/users/${user.id}`}
                        onClick={handleMenuClose}
                        className="block w-fit font-bold hover:underline"
                      >
                        {user.name}
                      </Link>
                      <Link
                        to={`/users/${user.id}`}
                        onClick={handleMenuClose}
                        className="block w-fit"
                      >
                        @{user.username}
                      </Link>
                    </div>
                    <div className="flex gap-5 text-sm">
                      <Link
                        to={`/users/${user.id}/following`}
                        onClick={handleMenuClose}
                        className="hover:underline"
                      >
                        <span className="font-bold">
                          {user._count.following}
                        </span>{" "}
                        Following
                      </Link>
                      <Link
                        to={`/users/${user.id}/followers`}
                        onClick={handleMenuClose}
                        className="hover:underline"
                      >
                        <span className="font-bold">
                          {user._count.followers}
                        </span>{" "}
                        Followers
                      </Link>
                    </div>
                  </div>
                  <div className="relative mt-6 flex flex-1 flex-col">
                    <Link
                      to="/"
                      onClick={handleMenuClose}
                      className="flex items-center p-4 text-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <HomeIcon className="mr-6 size-6 stroke-2" />
                      Home
                    </Link>
                    <Link
                      to="/explore"
                      onClick={handleMenuClose}
                      className="flex items-center p-4 text-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <MagnifyingGlassIcon className="mr-6 size-6 stroke-2" />
                      Explore
                    </Link>
                    <Link
                      to="/users"
                      onClick={handleMenuClose}
                      className="flex items-center p-4 text-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <UserPlusIcon className="mr-6 size-6 stroke-2" />
                      Follow People
                    </Link>
                    <Link
                      to={`/users/${user.id}`}
                      onClick={handleMenuClose}
                      className="flex items-center p-4 text-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <UserIcon className="mr-6 size-6 stroke-2" />
                      Profile
                    </Link>
                    <Link
                      to="/history"
                      onClick={handleMenuClose}
                      className="flex items-center p-4 text-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <BookmarkIcon className="mr-6 size-6 stroke-2" />
                      History
                    </Link>
                    <button
                      onClick={logout}
                      className="flex cursor-pointer items-center p-4 text-left text-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <ArrowRightEndOnRectangleIcon className="mr-6 size-6 stroke-2" />
                      Log out
                    </button>
                    <div>
                      <div className="m-auto h-px w-[89%] bg-black/10 dark:bg-white/10"></div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AppLayout;
