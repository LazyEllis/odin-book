import { useContext } from "react";
import { ConfirmationDialogContext } from "../contexts/ConfirmationDialogContext";

export const useConfirmationDialog = () =>
  useContext(ConfirmationDialogContext);
