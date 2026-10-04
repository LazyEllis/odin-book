import { useState, type ChangeEvent, type FC, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { createPost } from "../lib/api-client";
import type { PostCreate } from "../interfaces/api";
import ErrorAlert from "./ErrorAlert";
import Loader from "./Loader";
import Textarea from "./Textarea";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const initialData: PostCreate = {
  text: "",
  inReplyToPostId: null,
  quotedPostId: null,
};

const PostForm: FC<Props> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState(initialData);

  const navigate = useNavigate();

  const handleClose = () => {
    setFormData(initialData);
    onClose();
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (post) => {
      navigate(`/posts/${post.id}`);
      handleClose();
    },
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      as="div"
      className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
    >
      <DialogBackdrop
        transition
        className="darK:bg-gray-900/50 fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div
        tabIndex={0}
        className="flex min-h-full items-center justify-center p-4 text-center focus:outline-none sm:p-0"
      >
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 dark:bg-gray-800"
        >
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800">
              <DialogTitle
                as="h2"
                className="text-base font-semibold text-black dark:text-white"
              >
                Compose a Post
              </DialogTitle>

              <div className="mt-3 space-y-6">
                {mutation.error && <ErrorAlert error={mutation.error} />}

                <Textarea
                  name="text"
                  label="Message"
                  variant="textarea"
                  rows={3}
                  required
                  onChange={handleChange}
                  value={formData.text}
                />
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-700/25">
              <button
                disabled={mutation.isPending}
                className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:ml-3 sm:w-auto dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-white/90 dark:focus-visible:outline-white"
              >
                {mutation.isPending && <Loader isButton />}{" "}
                {mutation.isPending ? "Posting..." : "Post"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-white/10 dark:text-white dark:inset-ring-white/5 dark:hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default PostForm;
