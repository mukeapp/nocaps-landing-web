
export class NocapPostCommentLikes {
  documentId?: string; // Unique identifier for the document
  id?: string; // Unique identifier for the Like
  userId?: string; // Unique identifier for the user
  nocapPostCommentId?: string; // Unique identifier for the nocaps post comment
  isLike?: boolean; // Indicates if it is a like
  emotionId?: string; // Unique identifier for the emotion
  createdAt?: Date; // Timestamp for when the Like was created
  updatedAt?: Date; // Timestamp for the last update to the Like
}


export interface NocapPostCommentComponent {
  documentId?: string;
  id?: string;
  userId?: string;
  nocapPostId?: string;
  parentNocapPostCommentId?: string;
  title?: string;
  content?: string;
  noCapPostCommentLikes?: NocapPostCommentLikes[];
  createdAt?: Date;
  updatedAt?: Date;
}
