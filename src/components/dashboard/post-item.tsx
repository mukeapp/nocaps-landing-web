"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Info, MessageSquare, MoreVertical, Package, Send, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { NocapPost, NocapPostComment } from "@/types/section-c/post";
import {
  CreateNocapPostComment,
  CreateNocapPostLike,
  DeleteNocapPostCommentDataPurge,
  DeleteNocapPostDataPurge,
  DeleteNocapPostLike,
  GetNocapPostCommentComponentsByPostId,
} from "@/lib/api/section-c/posts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

/**
 * Mirrors mobile's PostItem (core/components/section-c/PostItem): header
 * (avatar + username + location, ⋮ menu), full-width image, actions row
 * (heart w/ count badge, Comment, Habit, Info), "Liked by …", bold title,
 * gray content, "View all comments" opening the comments bottom sheet.
 */
export function PostItem({
  post,
  currentUserId,
  onDeleted,
}: {
  post: NocapPost;
  currentUserId: string;
  onDeleted?: () => void;
}) {
  const initialLike = (post.nocapPostLikes ?? []).find(
    (like) => like.userId === currentUserId && like.isLiked,
  );
  const [liked, setLiked] = useState(Boolean(initialLike));
  const [likeDocId, setLikeDocId] = useState<string | undefined>(initialLike?.documentId);
  const othersCount = (post.nocapPostLikes ?? []).filter(
    (like) => like.isLiked && like.userId !== currentUserId,
  ).length;
  const displayCount = othersCount + (liked ? 1 : 0);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<NocapPostComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canEdit = post.userId === currentUserId;
  const postId = post.id ?? post.documentId ?? "";

  async function toggleLike() {
    const nowLiked = !liked;
    setLiked(nowLiked);
    if (nowLiked) {
      const res = await CreateNocapPostLike({
        id: crypto.randomUUID(),
        userId: currentUserId,
        nocapPostId: postId,
      });
      if (res.status >= 200 && res.status < 300) {
        setLikeDocId((res.data as any)?.documentId);
      } else {
        setLiked(false);
      }
    } else if (likeDocId) {
      const res = await DeleteNocapPostLike(likeDocId);
      if (res.status >= 200 && res.status < 300) {
        setLikeDocId(undefined);
      } else {
        setLiked(true);
      }
    }
  }

  async function openComments() {
    setCommentsOpen(true);
    const res = await GetNocapPostCommentComponentsByPostId(postId);
    setComments(Array.isArray(res.data) ? res.data : []);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    const now = new Date().toISOString();
    const res = await CreateNocapPostComment({
      id: crypto.randomUUID(),
      nocapPostId: postId,
      userId: currentUserId,
      content: commentText.trim(),
      createdAt: now,
      updatedAt: now,
    });
    if (res.status >= 200 && res.status < 300) {
      setCommentText("");
      const refreshed = await GetNocapPostCommentComponentsByPostId(postId);
      setComments(Array.isArray(refreshed.data) ? refreshed.data : []);
    } else {
      toast.error("Failed to post comment.");
    }
  }

  async function deleteComment(comment: NocapPostComment) {
    const res = await DeleteNocapPostCommentDataPurge(comment.documentId ?? comment.id ?? "");
    if (res.status >= 200 && res.status < 300) {
      setComments((prev) => prev.filter((c) => c.documentId !== comment.documentId));
    } else {
      toast.error("Failed to delete comment.");
    }
  }

  async function deletePost() {
    const res = await DeleteNocapPostDataPurge(post.documentId ?? post.id ?? "");
    if (res.status >= 200 && res.status < 300) {
      toast.success("Post deleted.");
      onDeleted?.();
    } else {
      toast.error("Failed to delete post.");
    }
  }

  return (
    <div className="border-b border-[#222] pb-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-2">
        <div className="flex items-center">
          <Image
            src={post.user?.photo || "/assets/images/default-avatar.png"}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="pl-2">
            <p className="text-[14px] font-bold text-white">{post.user?.username}</p>
            {post.location ? <p className="text-[12px] text-[#888]">{post.location}</p> : null}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 text-white">
              <MoreVertical className="h-4.5 w-4.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canEdit ? (
              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => toast.info("Thanks for letting us know. We will review this post.")}>
                Report
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post image */}
      {post.imageUrl ? (
        <div className="relative h-[420px] w-full overflow-hidden bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex items-center gap-4 px-1 py-2">
        <button onClick={toggleLike} className="relative flex items-center gap-1.5 text-white">
          <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          {displayCount > 0 ? (
            <span className="absolute -right-2 -top-1.5 rounded-full bg-white px-1 text-[9px] font-bold text-black">
              {displayCount > 99 ? "99+" : displayCount}
            </span>
          ) : null}
        </button>
        <button onClick={openComments} className="flex items-center gap-1.5 text-white">
          <MessageSquare className="h-5 w-5" />
          <span className="text-[12px]">Comment</span>
        </button>
        {post.habitStackId ? (
          <span className="flex items-center gap-1.5 text-white">
            <Package className="h-5 w-5" />
            <span className="text-[12px]">Habit</span>
          </span>
        ) : null}
        <span className="flex items-center gap-1.5 text-white">
          <Info className="h-5 w-5" />
          <span className="text-[12px]">Info</span>
        </span>
      </div>

      {/* Likes + content */}
      <div className="px-1">
        {(othersCount > 0 || liked) && (
          <p className="flex flex-wrap items-center gap-1 text-[14px] font-semibold text-white">
            Liked by {liked ? "you" : ""}
            {liked && othersCount > 0 ? " and" : ""}
            {othersCount > 0 ? (
              <span className="rounded-full bg-[#3a3a3a] px-2.5 py-0.5 text-[13px] font-semibold text-white">
                {othersCount} others
              </span>
            ) : null}
          </p>
        )}
        <p className="py-0.5 text-[14px] font-bold text-white">{post.title}</p>
        {post.content ? <p className="py-0.5 text-[13px] text-[#ccc]">{post.content}</p> : null}
        <button onClick={openComments} className="py-0.5 text-[13px] text-[#666]">
          View all comments
        </button>
      </div>

      {/* Comments bottom sheet */}
      <Sheet open={commentsOpen} onOpenChange={setCommentsOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[70vh] overflow-y-auto rounded-t-2xl border-none bg-[#2C2C2E]"
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#898B9A]" />
          <SheetHeader>
            <SheetTitle className="text-white">Comments</SheetTitle>
          </SheetHeader>
          <div className="mt-3 space-y-3 pb-4">
            {comments.length === 0 ? (
              <p className="py-6 text-center text-sm text-white/50">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.documentId ?? comment.id} className="flex items-start gap-2.5">
                  <Image
                    src={comment.user?.photo || "/assets/images/default-avatar.png"}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1 rounded-xl bg-white/5 px-3 py-2">
                    <p className="text-[12px] font-bold text-white">{comment.user?.username}</p>
                    <p className="text-[13px] text-white/80">{comment.content}</p>
                  </div>
                  {comment.userId === currentUserId ? (
                    <button onClick={() => deleteComment(comment)} className="p-1 text-white/40 hover:text-white">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              ))
            )}
            <form onSubmit={submitComment} className="flex items-center gap-2 pt-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-full border border-[#3A3A3A] bg-[rgba(41,41,41,1)] px-4 py-2 text-[13px] text-white placeholder:text-white/40 outline-none"
              />
              <Button type="submit" size="iconx">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{post.title}</span>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletePost}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
