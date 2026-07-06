import { PageFetcherNocapPost } from "@/core/models/section-c";
import { useCallback, useRef, useState } from "react";

const PAGE_SIZE = 5;

export function useInfiniteListNoCapPost<T>(fetchPage: PageFetcherNocapPost<T>, postVisibility: number) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  const loadNext = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetchPage(postVisibility, pageRef.current, PAGE_SIZE);
      const newItems = Array.isArray(res.items) ? res.items : [];
      setData((prev) => [...prev, ...newItems]);
      hasMoreRef.current = res.hasMore;
      setHasMore(res.hasMore);
      pageRef.current += 1;
      setPage(pageRef.current);
    } catch (err) {
      console.error("useInfiniteListNoCapPost loadNext error:", err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [fetchPage, postVisibility]);

  const reset = useCallback(async () => {
    setData([]);
    pageRef.current = 1;
    setPage(1);
    hasMoreRef.current = true;
    setHasMore(true);
    loadingRef.current = false;
  }, []);

  return { data, loading, hasMore, loadNext, reset, setData };
}
