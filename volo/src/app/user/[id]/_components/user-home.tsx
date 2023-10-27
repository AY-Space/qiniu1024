import { Avatar, Stack } from "@mui/joy";
import { type Video, type User } from "@prisma/client";

export interface UserHomeProps {
  user: Pick<User, "id" | "name" | "avatarUrl" | "bio" | "bannerUrl"> & {
    followings: number;
    followers: number;
  };
  uploadedVideos: Pick<Video, "id" | "title" | "coverUrl" | "views">[];
}

export const UserHome = ({ user }: UserHomeProps) => {
  return (
    <Stack>
      {user.name}
      <Avatar src={user.avatarUrl ?? undefined} />
      <Stack>{JSON.stringify(user, null, 2)}</Stack>
    </Stack>
  );
};
