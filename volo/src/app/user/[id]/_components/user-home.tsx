import { Stack } from "@mui/joy";
import { type User } from "@prisma/client";

export type UserDisplay = Pick<User, "id" | "name" | "avatarUrl" | "bio"> & {
  followings: number;
  followers: number;
};

export interface UserHomeProps {
  user: UserDisplay;
}

export const UserHome = ({ user }: UserHomeProps) => {
  return <Stack>{user.name}</Stack>;
};
