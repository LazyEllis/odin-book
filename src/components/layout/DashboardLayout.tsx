import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
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
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon as HomeSolidIcon } from "@heroicons/react/24/solid";
import { classNames } from "../../utils/format";
import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";
import Loader from "../ui/Loader";
import Logo from "../ui/Logo";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, error } = useProfile();
  const { logout } = useAuth();

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  if (error && error.message === "Unauthorized") {
    logout();
  }

  return (
    <div className="flex h-full flex-col">
      <header className="mx-auto flex h-13.25 w-full flex-row items-center justify-between border-b border-black/10 px-4 dark:border-white/20">
        {data ? (
          <button
            onClick={handleOpen}
            className="focus-visible:outline-primary relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span className="sr-only">Open user menu</span>
            <img
              alt=""
              src={data.profileImageUrl}
              className="size-8 cursor-pointer rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
            />
          </button>
        ) : (
          <Loader />
        )}
        <div className="flex shrink-0 items-center">
          <span className="sr-only">Chirp</span>
          <Logo className="size-8" />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <nav className="flex h-14 max-h-[16vh] flex-row border-t border-black/10 dark:border-white/20">
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
          to={`/users/${data?.id}`}
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
          to="/bookmarks"
          className="flex grow flex-col items-center justify-center"
        >
          {({ isActive }) => (
            <div className="rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10">
              <span className="sr-only">Bookmarks</span>
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

      <Dialog open={isOpen} onClose={handleClose} className="relative z-10">
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
                      onClick={handleClose}
                      className="focus-visible:outline-primary relative rounded-md text-gray-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-gray-400 dark:hover:text-white"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>
                </TransitionChild>
                <div className="relative flex h-full flex-col overflow-y-auto bg-white py-4 shadow-xl dark:bg-black dark:after:absolute dark:after:inset-y-0 dark:after:left-0 dark:after:w-px dark:after:bg-white/10">
                  {data ? (
                    <>
                      <div className="px-4">
                        <div className="mb-2">
                          <Link
                            to={`/users/${data.id}`}
                            className="focus-visible:outline-primary block w-fit rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
                          >
                            <span className="sr-only">Open user profile</span>
                            <img
                              alt=""
                              src={data.profileImageUrl}
                              className="size-8 cursor-pointer rounded-full bg-black outline -outline-offset-1 outline-white/10"
                            />
                          </Link>
                        </div>
                        <div className="mb-3">
                          <Link
                            to={`/users/${data.id}`}
                            className="block w-fit font-bold hover:underline"
                          >
                            {data.name}
                          </Link>
                          <Link
                            to={`/users/${data.id}`}
                            className="block w-fit"
                          >
                            @{data.username}
                          </Link>
                        </div>
                        <div className="flex gap-5 text-sm">
                          <Link
                            to={`/users/${data.id}/following`}
                            className="hover:underline"
                          >
                            <span className="font-bold">
                              {data._count.following}
                            </span>{" "}
                            Following
                          </Link>
                          <Link
                            to={`/users/${data.id}/followers`}
                            className="hover:underline"
                          >
                            <span className="font-bold">
                              {data._count.followers}
                            </span>{" "}
                            Followers
                          </Link>
                        </div>
                      </div>
                      <div className="relative mt-6 flex flex-1 flex-col">
                        <Link
                          to="/"
                          onClick={handleClose}
                          className="flex items-center p-4 text-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                        >
                          <HomeIcon className="mr-6 size-6 stroke-2" />
                          Home
                        </Link>
                        <Link
                          to="/explore"
                          onClick={handleClose}
                          className="flex items-center p-4 text-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                        >
                          <MagnifyingGlassIcon className="mr-6 size-6 stroke-2" />
                          Explore
                        </Link>
                        <Link
                          to="/users"
                          onClick={handleClose}
                          className="flex items-center p-4 text-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                        >
                          <UserPlusIcon className="mr-6 size-6 stroke-2" />
                          Follow People
                        </Link>
                        <Link
                          to={`/users/${data.id}`}
                          onClick={handleClose}
                          className="flex items-center p-4 text-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                        >
                          <UserIcon className="mr-6 size-6 stroke-2" />
                          Profile
                        </Link>
                        <Link
                          to={`/bookmarks`}
                          onClick={handleClose}
                          className="flex items-center p-4 text-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                        >
                          <BookmarkIcon className="mr-6 size-6 stroke-2" />
                          Bookmarks
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
                    </>
                  ) : (
                    <div className="px-4">
                      <Loader />
                    </div>
                  )}
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DashboardLayout;
