import {
  type Collection,
  type Comment,
  type Tag,
  type User,
  type Video,
} from "@prisma/client";

export type UserPublic = Pick<User, "id" | "name" | "avatarUrl">;
export type UserDetailedPublic = Pick<
  User,
  "id" | "name" | "avatarUrl" | "bannerUrl" | "bio"
> & {
  followers: number;
  following: number;
};

export type CommentPublic = Pick<
  Comment,
  "id" | "text" | "createdAt" | "imgUrl"
> & {
  likes: number;
  dislikes: number;
  author: UserPublic;
  currentUser: {
    liked: boolean;
    disliked: boolean;
  } | null;
};

export type TagPublic = Pick<Tag, "id" | "name" | "type">;
export type TagReference = Pick<Tag, "id" | "type">;

export type VideoPublic = Pick<
  Video,
  "id" | "coverUrl" | "createdAt" | "title" | "views"
>;

export type VideoDetailedPublic = Pick<
  Video,
  "id" | "coverUrl" | "createdAt" | "description" | "title" | "url" | "views"
> & {
  likes: number;
  author: UserPublic;
  comments: number;
} & {
  tags: TagPublic[];
};

export type CollectionPublic = Pick<Collection, "id" | "name">;

export enum GorseFeedback {
  READALL = "read_all",
  LIKED = "liked",
  COLLECTED = "collected",
  SHARED = "shared",
  READ = "read",
  LESS = "less",
}
