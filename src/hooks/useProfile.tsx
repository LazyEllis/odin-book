import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../lib/api-client";

const useProfile = () =>
  useQuery({ queryFn: getCurrentUser, queryKey: ["users", "me"] });

export default useProfile;
