"use client";

import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import { Flex } from "~/app/_components/flex";
import { type VideoPublic, type UserDetailedPublic } from "~/types";
import { VideoTabPanel } from "./video-tab-panel";
import { LikeTabPanel } from "./like-tab-panel";
import { CollectionTabPanel } from "./collection-tab-panel";
import { useSession } from "next-auth/react";
import { Edit } from "@mui/icons-material";
import { useState } from "react";
import { EditDialog } from "./edit-dialog";
import { FollowButton } from "~/app/_components/follow-button";

export interface UserHomeProps {
  user: UserDetailedPublic;
  uploadedVideos: VideoPublic[];
}

export const UserHome = ({ user, uploadedVideos }: UserHomeProps) => {
  const { data: session } = useSession();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const isSelf = session?.userId === user.id;

  return (
    <Stack spacing={3}>
      {user.bannerUrl && (
        <Box
          sx={{
            borderRadius: "lg",
            backgroundImage: `url(${user.bannerUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            aspectRatio: 5 / 1,
          }}
        />
      )}

      <Flex spacing={3}>
        <Avatar
          src={user.avatarUrl ?? undefined}
          sx={{
            "&": {
              "--Avatar-size": "128px",
            },
          }}
        />
        <Stack justifyContent="space-evenly">
          <Typography
            level="h1"
            endDecorator={
              isSelf ? (
                <IconButton onClick={() => setShowEditDialog(true)}>
                  <Edit />
                </IconButton>
              ) : (
                <FollowButton followUserId={user.id} />
              )
            }
          >
            {user.name}
          </Typography>
          <Typography>{`${user.followers} 粉丝数 · ${user.following} 关注数`}</Typography>
          <Typography>{user.bio ?? "没有写简介的说～"}</Typography>
        </Stack>
      </Flex>

      <Tabs sx={{ borderRadius: "lg" }}>
        <TabList>
          <Tab variant="plain" color="neutral">
            视频
          </Tab>
          {isSelf && (
            <Tab variant="plain" color="neutral">
              喜欢
            </Tab>
          )}
          {isSelf && (
            <Tab variant="plain" color="neutral">
              收藏
            </Tab>
          )}
        </TabList>
        <TabPanel value={0}>
          <VideoTabPanel videos={uploadedVideos} isSelf={isSelf} />
        </TabPanel>
        {isSelf && (
          <TabPanel value={1}>
            <LikeTabPanel userId={user.id} />
          </TabPanel>
        )}
        {isSelf && (
          <TabPanel value={2}>
            <CollectionTabPanel />
          </TabPanel>
        )}
      </Tabs>

      {isSelf && (
        <EditDialog
          user={user}
          open={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
          }}
        />
      )}
    </Stack>
  );
};
