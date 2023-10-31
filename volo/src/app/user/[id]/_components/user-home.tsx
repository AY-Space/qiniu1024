import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardCover,
  Grid,
  Stack,
  SvgIcon,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import { type Video, type User } from "@prisma/client";
import { Flex } from "~/app/_components/flex";
import { getBilibiliImageUrl } from "~/app/utils";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
export interface UserHomeProps {
  user: Pick<User, "id" | "name" | "avatarUrl" | "bio" | "bannerUrl"> & {
    followings: number;
    followers: number;
  };
  uploadedVideos: Pick<Video, "id" | "title" | "coverUrl" | "views">[];
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
            aspectRatio: 4 / 1,
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
          <Typography>{`${user.followers} 粉丝数 · ${user.followings} 关注数`}</Typography>
        </Stack>
      </Flex>

      <Tabs sx={{ borderRadius: "lg" }}>
        <TabList>
          <Tab variant="plain" color="neutral">
            视频
          </Tab>
        </TabList>
        <TabPanel>
          <Grid container columns={6}>
            {uploadedVideos.map((e) => (
              <Grid
                key={e.id}
                xs={2}
                sx={{
                  p: 1,
                }}
              >
                <VideoCard video={e} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Tabs>
    </Stack>
  );
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
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
          <SvgIcon size="sm">
            <RemoveRedEyeIcon />
          </SvgIcon>
          <Typography level="body-sm">{formatNumber(video.views)}</Typography>
        </Flex>
      </CardContent>
    </Card>
  );
};
