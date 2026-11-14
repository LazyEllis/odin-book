import { createContext } from "react";

interface Props {
  toggleDelete: (postId: number) => void;
  togglePin: (postId: number) => void;
}

export const ConfirmationDialogContext = createContext({} as Props);
