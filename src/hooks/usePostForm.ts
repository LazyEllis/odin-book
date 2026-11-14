import { useContext } from "react";
import { PostFormContext } from "../contexts/PostFormContext";

export const usePostForm = () => useContext(PostFormContext);
