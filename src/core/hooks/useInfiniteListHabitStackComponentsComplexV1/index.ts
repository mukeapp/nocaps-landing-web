import { PageFetcherNocapPost } from "@/core/models/section-c";
import { useCallback, useRef, useState } from "react";

const PAGE_SIZE = 5;

export function useInfiniteListHabitStackComponentsComplexV1<T>(fetchPage: PageFetcherNocapPost<T>, postVisibility: number) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);
  const generationRef = useRef(0);

  const loadNext = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    // Capture the current generation so we can discard results from stale requests
    // (i.e. requests that were in-flight when reset() was called).
    const gen = generationRef.current;
    try {
      const res = await fetchPage(postVisibility, page, PAGE_SIZE);
      if (gen !== generationRef.current) return;
      const newItems = Array.isArray(res.items) ? res.items : [];
      setData((prev) => [...prev, ...newItems]);
      setHasMore(res.hasMore);
      setPage((p) => p + 1);
    } catch (err) {
      if (gen !== generationRef.current) return;
      console.error("useInfiniteListHabitStackComponentsComplexV1 loadNext error:", err);
    } finally {
      // Only release the loading state for the current (non-stale) generation.
      // Stale requests skip this because reset() already cleared the loading
      // state and a fresh request may currently be in-flight.
      if (gen === generationRef.current) {
        setLoading(false);
        loadingRef.current = false;
      }
    }
  }, [fetchPage, hasMore, page, postVisibility]);

  const reset = useCallback(async () => {
    // Incrementing the generation invalidates any in-flight loadNext() calls so
    // their results are discarded when they complete.
    generationRef.current += 1;
    setData([]);
    setPage(1);
    setHasMore(true);
    // Reset the concurrency guard synchronously so the next loadNext() can proceed.
    loadingRef.current = false;
    // Also clear the UI loading state immediately so the spinner disappears when
    // a reset occurs mid-flight (loadingRef and loading are distinct: one is the
    // internal guard, the other drives the UI).
    setLoading(false);
  }, []);

  return { data, loading, hasMore, loadNext, reset, setData };
}
