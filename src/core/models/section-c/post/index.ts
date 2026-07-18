import {IUser} from "../../section-a";
import {HabitStackComponent} from "../../section-b";

export interface NocapPostLike {
  documentId?: string;
  id?: string;
  userId?: string;
  isLiked?: boolean;
  emotionId?: string;
  createdAt?: { _seconds: number; _nanoseconds: number };
  updatedAt?: { _seconds: number; _nanoseconds: number };
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
  createdAt?: { _seconds: number; _nanoseconds: number };
  updatedAt?: { _seconds: number; _nanoseconds: number };
  user?: IUser;
  nocapPostLikes?: NocapPostLike[];
  habitStackComponent?: HabitStackComponent;
}

export interface PostProps {
  posts: NocapPost[];
  currentUserId: string;
}

export type PageFetcherNocapPost<T> = (
  postVisibility: number,
  page: number,
  pageSize: number,
) => Promise<{ items: T[]; hasMore: boolean }>;