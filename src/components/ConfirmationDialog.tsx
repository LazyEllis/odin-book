import type { FC } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { currentUserOptions } from "../utils/query-options";
import { deletePost } from "../lib/api-client";
import Loader from "./Loader";

interface Props {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}

const PostConfirmationDialog: FC<Props> = ({ isOpen, onClose, postId }) => {
  const navigate = useNavigate();

  const { data: currentUser } = useQuery(currentUserOptions);

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      onClose();
      navigate(`/users/${currentUser?.id}`);
    },
  });

  const handleDelete = () => deleteMutation.mutate(postId);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-gray-900/50"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95 dark:bg-neutral-900 dark:outline dark:-outline-offset-1 dark:outline-white/10"
          >
            <div className="sm:flex sm:items-start">
              <div className="text-center sm:text-left">
                <DialogTitle
                  as="h2"
                  className="text-base font-semibold text-gray-900 dark:text-white"
                >
                  Delete Post?
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This can't be undone and it will be removed from your
                    profile, the timeline of any accounts that follow you, and
                    from search results.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                onClick={handleDelete}
                className="inline-flex w-full cursor-pointer justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-700 sm:ml-3 sm:w-auto dark:bg-red-500 dark:shadow-none dark:hover:bg-red-600"
              >
                {deleteMutation.isPending && <Loader />}{" "}
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                data-autofocus
                onClick={onClose}
                disabled={deleteMutation.isPending}
                className="mt-3 inline-flex w-full cursor-pointer justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default PostConfirmationDialog;
