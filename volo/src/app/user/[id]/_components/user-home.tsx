"use client";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardCover,
  Grid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
  Button,
} from "@mui/joy";
import { Flex } from "~/app/_components/flex";
import { getBilibiliImageUrl } from "~/app/utils";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";
import { type VideoPublic, type UserDetailedPublic } from "~/types";
import { Add, VideoLibrary } from "@mui/icons-material";
import { useState } from "react";
import { CreateCollectionModal } from "~/app/_components/create-collection-modal";
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

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(num >= 10000 ? 0 : 1) + "K";
  } else {
    return num.toString();
  }
};

const VideoCard = ({
  video,
}: {
  video: UserHomeProps["uploadedVideos"][0];
}) => {
  return (
    <Link href={`/video/${video.id}`}>
      <Card
        sx={{
          aspectRatio: 4 / 3,
        }}
      >
        <CardCover>
          <Box
            sx={{
              borderRadius: "lg",
              backgroundImage: `url(${getBilibiliImageUrl(video.coverUrl)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </CardCover>
        <CardCover
          sx={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 40px)",
          }}
        />
        <CardContent sx={{ justifyContent: "flex-end" }}>
          <Flex spacing={1} alignItems="center">
            <Typography
              level="title-md"
              sx={{
                flex: 1,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {video.title}
            </Typography>
            <Flex spacing="0.3em" alignItems="center">
              <RemoveRedEyeIcon fontSize="small" />
              <Typography
                level="body-sm"
                sx={{
                  color: "text.secondary",
                }}
              >
                {formatNumber(Number(video.views))}
              </Typography>
            </Flex>
          </Flex>
        </CardContent>
      </Card>
    </Link>
  );
};
const VideoTabPanel = ({
  uploadedVideos,
  value,
}: {
  uploadedVideos: VideoPublic[];
  value: number;
}) => {
  return (
    <TabPanel value={value}>
      <Grid
        container
        columns={{
          xs: 2,
          sm: 3,
          md: 4,
        }}
      >
        {uploadedVideos.map((e) => (
          <Grid
            key={e.id}
            xs={1}
            sx={{
              p: 1,
            }}
          >
            <VideoCard video={e} />
          </Grid>
        ))}
      </Grid>
    </TabPanel>
  );
};

const LikeTabPanel = ({ userId, value }: { userId: string; value: number }) => {
  return (
    <TabPanel value={value}>
      <Grid
        container
        columns={{
          xs: 2,
          sm: 3,
          md: 4,
        }}
      ></Grid>
    </TabPanel>
  );
};

const CollectionTabPanel = ({
  userId,
  value,
}: {
  userId: string;
  value: number;
}) => {
  const [showCreateCollection, setShowCreateCollection] = useState(false);

  return (
    <TabPanel value={value}>
      <Tabs
        aria-label="Vertical tabs"
        orientation="vertical"
        sx={{ minWidth: 300, height: 160 }}
      >
        <TabList>
          <Button
            variant="plain"
            startDecorator={<Add />}
            onClick={() => setShowCreateCollection(true)}
          >
            创建收藏夹
          </Button>
          <Tab sx={{ display: "flex", alignItems: "space-between" }}>
            <VideoLibrary />
            tab
          </Tab>
          <Tab>
            <VideoLibrary />
            Second tab
          </Tab>
          <Tab>
            <VideoLibrary />
            Third tab
          </Tab>
        </TabList>
        <TabPanel value={0}>
          <Grid
            container
            columns={{
              xs: 2,
              sm: 3,
              md: 4,
            }}
          ></Grid>
        </TabPanel>
        <TabPanel value={1}>
          <b>Second</b> tab panel
        </TabPanel>
        <TabPanel value={2}>
          <b>Third</b> tab panel
        </TabPanel>
      </Tabs>
      <CreateCollectionModal
        showCreateCollection={showCreateCollection}
        setShowCreateCollection={setShowCreateCollection}
      />
    </TabPanel>
  );
};
