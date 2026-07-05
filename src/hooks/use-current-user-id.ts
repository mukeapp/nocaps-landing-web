import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/user-data";

/** Firebase uid of the signed-in user, once AppBootstrap has populated redux. */
export function useCurrentUserId(): string | undefined {
  return useAppSelector(selectUser).userdata?.userId;
}
