import type { FC, ReactNode, SubmitEvent } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: SubmitEvent) => void;
  children: ReactNode;
}

const DialogForm: FC<Props> = ({
  title,
  isOpen,
  onClose,
  onSubmit,
  children,
}) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    as="div"
    className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
  >
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-gray-900/50"
    />

    <div
      tabIndex={0}
      className="flex min-h-full items-center justify-center p-0 text-center focus:outline-none"
    >
      <DialogPanel
        transition
        className="absolute inset-y-0 w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:relative sm:my-8 sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 dark:bg-gray-800"
      >
        <div className="px-4 pt-5 sm:px-6 sm:pt-6">
          <DialogTitle
            as="h2"
            className="text-base font-semibold text-black dark:text-white"
          >
            {title}
          </DialogTitle>
        </div>

        <form onSubmit={onSubmit} className="mt-3">
          {children}
        </form>
      </DialogPanel>
    </div>
  </Dialog>
);

export default DialogForm;
