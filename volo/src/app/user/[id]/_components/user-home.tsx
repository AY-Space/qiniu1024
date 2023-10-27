import { Stack } from "@mui/joy";
import { type Video, type User } from "@prisma/client";

export interface UserHomeProps {
  user: Pick<User, "id" | "name" | "avatarUrl" | "bio"> & {
    followings: number;
    followers: number;
  };
  uploadedVideos: Pick<Video, "id" | "title" | "coverUrl" | "views">[];
}

export const UserHome = ({ user }: UserHomeProps) => {
  return <Stack>{user.name}</Stack>;
};
