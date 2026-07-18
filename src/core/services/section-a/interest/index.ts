import { GetInterestAndSector, SaveUserInterest } from "@/core/api/section-a";
import { UserInterest } from "@/core/models/section-a";
import { showToast } from "@/core/utils";

/** Load the interest categories and their items for the swiper. */
export async function fetchInterestSectors(): Promise<any[]> {
  const res = await GetInterestAndSector();
  return (res?.data ?? []) as any[];
}

/**
 * Save the selected interests for a user.
 * Uses Promise.allSettled so one failure won't block others.
 * Throws only if *all* saves fail.
 */
export async function saveUserInterests(params: {
  selectedIds: (string)[];
  userAccountId?: string;    // userdata.collectdata.id
  userDocumentId?: string;   // userdata.collectdata.documentId
}) {
  const { selectedIds, userAccountId, userDocumentId } = params;

  if (!selectedIds?.length) return;

  if (!userAccountId || !userDocumentId) {
    showToast("Missing user information. Please sign in again.");
    throw new Error("Missing user identifiers");
  }

  const now = new Date();
  const payloads: UserInterest[] = selectedIds.map((interestId) => ({
    id: userAccountId,
    userId: userDocumentId,
    interestId,
    createdAt: now,
    updatedAt: now,
  }));

  const results = await Promise.allSettled(
    payloads.map((data) => SaveUserInterest({ data }))
  );

  const rejected = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];

  if (rejected.length) {
    console.log("Some interests failed to save:", rejected.map((r) => r.reason));
    if (rejected.length === results.length) {
      showToast("Unable to save your interests. Please try again.");
      throw new Error("All interest saves failed");
    } else {
      showToast("Some interests couldn't be saved. You can update them later.");
    }
  }
}
