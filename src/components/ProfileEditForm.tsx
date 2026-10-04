import { useState, type ChangeEvent, type FC, type SubmitEvent } from "react";
import { useParams } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "../lib/api-client";
import { currentUserOptions } from "../utils/query-options";
import type { InputProps, TextareaProps } from "../interfaces/props";
import type { UserUpdate } from "../interfaces/api";
import ErrorAlert from "./ErrorAlert";
import Input from "./Input";
import Loader from "./Loader";
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
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <div className="bg-white px-4 pb-4 sm:px-6 sm:pb-4 dark:bg-gray-800">
        <div className="space-y-6">
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
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-700/25">
        <button
          disabled={mutation.isPending}
          className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:ml-3 sm:w-auto dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-white/90 dark:focus-visible:outline-white"
        >
          {mutation.isPending && <Loader isButton />}{" "}
          {mutation.isPending ? "Saving..." : "Save"}
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

export default ProfileEditForm;
