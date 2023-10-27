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
} from "@mui/joy";
import { type Video, type User } from "@prisma/client";
import { Flex } from "~/app/_components/flex";

export interface UserHomeProps {
  user: Pick<User, "id" | "name" | "avatarUrl" | "bio" | "bannerUrl"> & {
    followings: number;
    followers: number;
  };
  uploadedVideos: Pick<Video, "id" | "title" | "coverUrl" | "views">[];
}

export const UserHome = ({ user, uploadedVideos }: UserHomeProps) => {
  return (
    <Stack>
      {user.bannerUrl && (
        <Box
          sx={{
            borderRadius: "lg",
            backgroundImage: `url(${user.bannerUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            aspectRatio: 4 / 1,
          }}
        />
      )}
      <Flex>
        <Avatar
          src={user.avatarUrl ?? undefined}
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

      <Tabs>
        <TabList>
          <Tab variant="plain" color="neutral">
            视频
          </Tab>{" "}
          <Tab variant="plain" color="neutral">
            视频
          </Tab>{" "}
          <Tab variant="plain" color="neutral">
            视频
          </Tab>{" "}
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
            backgroundImage:
              "url(https://avatars.githubusercontent.com/u/91730263)",
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
        <Typography level="title-md">{video.title}</Typography>
      </CardContent>
    </Card>
  );
};
