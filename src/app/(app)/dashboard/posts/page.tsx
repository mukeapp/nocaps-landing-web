"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { GetNocapPostComponentsPaginated } from "@/lib/api/section-c/posts";
import type { NocapPost } from "@/types/section-c/post";
import { PostItem } from "@/components/dashboard/post-item";
import { DataState } from "@/components/dashboard/data-state";
import { Button } from "@/components/ui/button";

/**
 * Mirrors mobile's NoCapPostHomeScreen: public post feed
 * (nocap-post-components by visibility), paginated, with a create shortcut.
 */
export default function PostsPage() {
  const userId = useCurrentUserId();
  const [posts, setPosts] = useState<NocapPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const load = useCallback((pageNumber: number) => {
    setLoading(true);
    GetNocapPostComponentsPaginated({ pageNumber, pageSize: 10, postVisibility: 1 })
      .then((res) => {
        const next: NocapPost[] =
          (res.data as any)?.nocapPostComponents ?? (Array.isArray(res.data) ? res.data : []);
        setPosts((prev) => (pageNumber === 1 ? next : [...prev, ...next]));
        setHasMore(next.length >= 10);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  return (
    <div className="mx-auto max-w-xl pb-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-white">NoCap Posts</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <DataState loading={(loading && page === 1) || !userId} error={null}>
        {posts.length === 0 ? (
          <div className="flex h-[40vh] items-center justify-center">
            <p className="text-base font-semibold text-white">No Post Found.</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostItem
                key={post.documentId ?? post.id}
                post={post}
                currentUserId={userId ?? ""}
                onDeleted={() => {
                  setPosts((prev) => prev.filter((p) => p.documentId !== post.documentId));
                }}
              />
            ))}
            {hasMore ? (
              <Button
                variant="outline"
                className="mt-3 w-full"
                disabled={loading}
                onClick={() => setPage((p) => p + 1)}
              >
                {loading ? "Loading..." : "Load more"}
              </Button>
            ) : null}
          </>
        )}
      </DataState>
    </div>
  );
}
