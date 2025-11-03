export interface Note {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  ratingsCount: number;
  commentsCount: number;
  createdAt: Date;
  tags: string[];
}

export interface Comment {
  id: string;
  noteId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  uploadedNotes: string[];
  savedNotes: string[];
}
