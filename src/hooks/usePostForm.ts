import { useOutletContext } from "react-router";
import type { PostFormContext } from "../interfaces/contexts";

export const usePostForm = () => useOutletContext<PostFormContext>();
