import { useState, type ChangeEvent, type FC, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../lib/api-client";
import type { PostCreate } from "../interfaces/api";
import ErrorAlert from "./ErrorAlert";
import Loader from "./Loader";
import Textarea from "./Textarea";
import DialogForm from "./DialogForm";

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

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (post) => {
      navigate(`/posts/${post.id}`);
      setFormData(initialData);
      onClose();
    },
  });

  const handleClose = () => {
    setFormData(initialData);
    onClose();
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <DialogForm
      title="Compose a Post"
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <div className="bg-white px-4 pb-4 sm:px-6 sm:pb-4 dark:bg-gray-800">
        <div className="space-y-6">
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
    </DialogForm>
  );
};

export default PostForm;
