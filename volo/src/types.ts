import { type Comment, type User, type Video } from "@prisma/client";

export type UserPublic = Pick<User, "id" | "name" | "avatarUrl">;
export type UserDetailedPublic = Pick<
  User,
  "id" | "name" | "avatarUrl" | "bannerUrl" | "bio"
>;

export type CommentPublic = Pick<
  Comment,
  "id" | "text" | "createdAt" | "imgUrl"
> & {
  author: UserPublic;
  currentUser?: {
    liked: boolean;
    disliked: boolean;
  };
};

export type VideoPublic = Pick<
  Video,
  "id" | "coverUrl" | "createdAt" | "description" | "title" | "url" | "views"
> & {
  likes: number;
  dislikes: number;
  author: UserPublic;
  comments: number;
};
