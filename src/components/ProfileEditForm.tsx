import { useState, type ChangeEvent, type FC, type SubmitEvent } from "react";
import { useParams } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "../lib/api-client";
import { currentUserOptions } from "../utils/query-options";
import type { InputProps, TextareaProps } from "../interfaces/props";
import type { UserUpdate } from "../interfaces/api";
import ErrorAlert from "./ErrorAlert";
import Input from "./Input";
import Textarea from "./Textarea";
import DialogForm from "./DialogForm";

interface Props {
  initialData: UserUpdate;
  isOpen: boolean;
  onClose: () => void;
}

const inputFields: (InputProps | TextareaProps)[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "username", label: "Username", type: "text", required: true },
  { name: "description", label: "Description", variant: "textarea", rows: 3 },
  { name: "location", label: "Location", type: "text" },
  { name: "url", label: "URL", type: "url" },
];

const ProfileEditForm: FC<Props> = ({ initialData, isOpen, onClose }) => {
  const [formData, setFormData] = useState(initialData);

  const queryClient = useQueryClient();
  const { userId } = useParams();

  const mutation = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(currentUserOptions.queryKey, updatedUser);
      queryClient.setQueryData(["users", Number(userId)], updatedUser);
      onClose();
    },
  });

  const handleClose = () => {
    setFormData(initialData);
    onClose();
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <DialogForm
      title="Edit Profile"
      action="Save"
      isOpen={isOpen}
      isPending={mutation.isPending}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      {mutation.error && <ErrorAlert error={mutation.error} />}

      {inputFields.map((field) =>
        field.variant === "textarea" ? (
          <Textarea
            {...field}
            value={formData[field.name as keyof UserUpdate] || ""}
            onChange={handleChange}
            key={field.name}
          />
        ) : (
          <Input
            {...field}
            value={formData[field.name as keyof UserUpdate] || ""}
            onChange={handleChange}
            key={field.name}
          />
        ),
      )}
    </DialogForm>
  );
};

export default ProfileEditForm;
