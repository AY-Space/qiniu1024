"use client";

import { Avatar, Box, Stack, Tab, TabList, Tabs, Typography } from "@mui/joy";
import { Flex } from "~/app/_components/flex";
import { getBilibiliImageUrl } from "~/app/utils";
import { type VideoPublic, type UserDetailedPublic } from "~/types";
import { VideoTabPanel } from "./video-tab-panel";
import { LikeTabPanel } from "./like-tab-panel";
import { CollectionTabPanel } from "./collection-tab-panel";

export interface UserHomeProps {
  user: UserDetailedPublic;
  uploadedVideos: VideoPublic[];
}

export const UserHome = ({ user, uploadedVideos }: UserHomeProps) => {
  return (
    <Stack spacing={3}>
      {user.bannerUrl && (
        <Box
          sx={{
            borderRadius: "lg",
            backgroundImage: `url(${getBilibiliImageUrl(user.bannerUrl)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            aspectRatio: 5 / 1,
          }}
        />
      )}
      <Flex spacing={3}>
        <Avatar
          src={user.avatarUrl ? getBilibiliImageUrl(user.avatarUrl) : undefined}
          sx={{
            "&": {
              "--Avatar-size": "128px",
            },
          }}
        />
        <Stack justifyContent="space-evenly">
          <Typography level="h1">{user.name}</Typography>
          <Typography>{`${user.followers} 粉丝数 · ${user.following} 关注数`}</Typography>
        </Stack>
      </Flex>

      <Tabs sx={{ borderRadius: "lg" }}>
        <TabList>
          <Tab variant="plain" color="neutral">
            视频
          </Tab>
          <Tab variant="plain" color="neutral">
            喜欢
          </Tab>
          <Tab variant="plain" color="neutral">
            收藏
          </Tab>
        </TabList>
        <VideoTabPanel uploadedVideos={uploadedVideos} value={0} />
        <LikeTabPanel userId={user.id} value={1} />
        <CollectionTabPanel userId={user.id} value={2} />
      </Tabs>
    </Stack>
  );
};
