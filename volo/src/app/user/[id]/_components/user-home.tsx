import {
  Accordion,
  AccordionGroup,
  AccordionSummary,
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
import { Flex } from "~/app/_components/flex";
import { getBilibiliImageUrl } from "~/app/utils";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";
import { type VideoPublic, type UserDetailedPublic } from "~/types";
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
        <AccordionGroup
          variant="outlined"
          transition="0.2s"
          sx={{
            borderRadius: "lg",
            // [`& .${accordionSummaryClasses.button}:hover`]: {
            //   bgcolor: "transparent",
            // },
            // [`& .${accordionDetailsClasses.content}`]: {
            //   boxShadow: (theme) => `inset 0 1px ${theme.vars.palette.divider}`,
            //   [`&.${accordionDetailsClasses.expanded}`]: {
            //     paddingBlock: "0.75rem",
            //   },
            // },
          }}
        >
          <Accordion defaultExpanded>
            <AccordionSummary>
              <Typography level="h3">First accordion</Typography>
            </AccordionSummary>
            {/* <AccordionDetails variant="soft">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </AccordionDetails> */}
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <Typography level="h3">Second accordion</Typography>
            </AccordionSummary>
            {/* <AccordionDetails variant="soft">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </AccordionDetails> */}
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <Typography level="h3">Third accordion</Typography>
            </AccordionSummary>
            {/* <AccordionDetails variant="soft">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </AccordionDetails> */}
          </Accordion>
        </AccordionGroup>
      </Grid>
    </TabPanel>
  );
};
