import { useState, type ChangeEvent, type FC, type SubmitEvent } from "react";
import { useParams } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { updateCurrentUser } from "../lib/api-client";
import { currentUserOptions } from "../utils/query-options";
import type { InputProps, TextareaProps } from "../interfaces/props";
import type { UserUpdate } from "../interfaces/api";
import ErrorAlert from "./ErrorAlert";
import Input from "./Input";
import Loader from "./Loader";
import Textarea from "./Textarea";

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
    <Dialog
      open={isOpen}
      onClose={onClose}
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
                Edit Profile
              </DialogTitle>

              <div className="mt-3 space-y-6">
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
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ProfileEditForm;
