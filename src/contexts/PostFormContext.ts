import { createContext } from "react";

interface Props {
  toggleReply: (postId: number) => void;
  toggleQuote: (postId: number) => void;
}

export const PostFormContext = createContext({} as Props);
