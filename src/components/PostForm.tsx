import { useState, type ChangeEvent, type FC, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../lib/api-client";
import type { PostCreate } from "../interfaces/api";
import ErrorAlert from "./ErrorAlert";
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
      action="Post"
      isOpen={isOpen}
      isPending={mutation.isPending}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
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
    </DialogForm>
  );
};

export default PostForm;
