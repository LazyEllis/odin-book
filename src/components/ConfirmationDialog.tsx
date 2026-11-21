import type { FC } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { deletePost, pinPost, unpinPost } from "../lib/api-client";
import { currentUserOptions } from "../utils/query-options";
import {
  classNames,
  continuousTense,
  getConfirmationContent,
} from "../utils/format";
import type { ConfirmationAction } from "../interfaces/props";
import Loader from "./Loader";

interface Props {
  postId: number;
  action: ConfirmationAction;
  isPostPinned: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const PostConfirmationDialog: FC<Props> = ({
  postId,
  action,
  isPostPinned,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery(currentUserOptions);

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      onClose();
      navigate(`/users/${currentUser?.id}`);
    },
  });

  const pinMutation = useMutation({
    mutationFn: isPostPinned ? unpinPost : pinPost,
    onSuccess: () => {
      onClose();
      queryClient.setQueryData(currentUserOptions.queryKey, (user) =>
        user ? { ...user, pinnedPostId: isPostPinned ? null : postId } : user,
      );
    },
  });

  const content = getConfirmationContent(action, isPostPinned);
  const activeMutation = action === "DELETE" ? deleteMutation : pinMutation;

  const handleConfirmation = () => activeMutation.mutate(postId);

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
                  {content.title}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {content.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                onClick={handleConfirmation}
                disabled={activeMutation.isPending}
                className={classNames(
                  "inline-flex w-full cursor-pointer justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto",
                  action === "DELETE"
                    ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:shadow-none dark:hover:bg-red-600"
                    : "bg-black hover:bg-black/75 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-white/90 dark:focus-visible:outline-white",
                )}
              >
                {activeMutation.isPending && <Loader isButton />}{" "}
                {activeMutation.isPending
                  ? continuousTense(content.action)
                  : content.action}
              </button>
              <button
                data-autofocus
                onClick={onClose}
                disabled={activeMutation.isPending}
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
