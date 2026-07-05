// Ported from mobile core/models/section-c/post.
import type { IUser } from "@/types/section-a/user";
import type { HabitStackComponent } from "@/types/section-b/habit";

export interface NocapPostLike {
  documentId?: string;
  id?: string;
  userId?: string;
  isLiked?: boolean;
  nocapPostId?: string;
}

export interface NocapPost {
  documentId?: string;
  id?: string;
  postVisibility?: number;
  title?: string;
  content?: string;
  habitType?: string;
  habitStackId?: string;
  habitId?: string;
  habitLinkId?: string;
  habitLinkItemId?: string;
  videoUrl?: string;
  audioUrl?: string;
  location?: string;
  imageUrl?: string;
  sector?: string;
  userId?: string;
  user?: IUser;
  nocapPostLikes?: NocapPostLike[];
  habitStackComponent?: HabitStackComponent;
  createdAt?: { _seconds: number; _nanoseconds: number } | string;
}

export interface NocapPostComment {
  documentId?: string;
  id?: string;
  nocapPostId?: string;
  userId?: string;
  content?: string;
  user?: IUser;
  createdAt?: { _seconds: number; _nanoseconds: number } | string;
}
