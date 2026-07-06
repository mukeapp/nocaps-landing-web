import {PageFetcher} from "@/core/models/section-b";
import { useCallback, useRef, useState } from "react";
import {useSelector} from "react-redux";



type RootState = any; // replace with your real RootState

type Props = { navigation: any; route: any };

const PAGE_SIZE = 10;

export function useInfiniteList<T>(fetchPage: PageFetcher<T>) {
  const userId: string = useSelector(
    (s: RootState) => s?.user?.userdata?.collectdata?.userId
  );
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);

  const loadNext = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetchPage(userId, page, PAGE_SIZE);
      setData((prev) => [...prev, ...res.items]);
      setHasMore(res.hasMore);
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [fetchPage, hasMore, page]);

  const reset = useCallback(async () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    loadingRef.current = false;
  }, []);

  return { data, loading, hasMore, loadNext, reset, setData };
}
