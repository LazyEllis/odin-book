import { useState, type ChangeEvent, type FC, type SubmitEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../lib/api-client";
import {
  getPostListOptions,
  getPostOptions,
  getRepliesOptions,
  getUserPostsOptions,
} from "../utils/query-options";
import ErrorAlert from "./ErrorAlert";
import Textarea from "./Textarea";
import DialogForm from "./DialogForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formOptions: {
    inReplyToPostId: number | null;
    quotedPostId: number | null;
  };
}

const postListOptions = getPostListOptions();

const PostForm: FC<Props> = ({ isOpen, onClose, formOptions }) => {
  const [text, setText] = useState("");

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleClose = () => {
    setText("");
    onClose();
  };

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (post) => {
      const userPostsOptions = getUserPostsOptions(
        post.author.id,
        `/users/${post.author.id}`,
      );

      // Updates the timeline and profile post lists with the created post
      queryClient.setQueryData(postListOptions.queryKey, (posts) =>
        posts ? [post, ...posts] : posts,
      );
      queryClient.setQueryData(userPostsOptions.queryKey, (posts) =>
        posts ? [post, ...posts] : posts,
      );

      if (post.repliedTo) {
        const postOptions = getPostOptions(post.repliedTo.id);
        const repliesOptions = getRepliesOptions(post.repliedTo.id);
        const userRepliesOptions = getUserPostsOptions(
          post.author.id,
          `/users/${post.author.id}/replies`,
        );

        // Updates the parent post's reply count if the created post is a reply
        queryClient.setQueryData(postOptions.queryKey, (post) =>
          post
            ? {
                ...post,
                _count: { ...post._count, replies: post._count.replies + 1 },
              }
            : post,
        );

        // Updates the parent post's and the user's profile's reply list if the created post is a reply
        queryClient.setQueryData(repliesOptions.queryKey, (replies) =>
          replies ? [post, ...replies] : replies,
        );
        queryClient.setQueryData(userRepliesOptions.queryKey, (replies) =>
          replies ? [post, ...replies] : replies,
        );
      }

      handleClose();
    },
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    mutation.mutate({ text, ...formOptions });
  };

  return (
    <DialogForm
      title={"Compose a Post"}
      action={formOptions.inReplyToPostId ? "Reply" : "Post"}
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
        value={text}
      />
    </DialogForm>
  );
};

export default PostForm;
