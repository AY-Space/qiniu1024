"use client";
import { Box, Card, CardContent, CardCover, Typography } from "@mui/joy";
import { Flex } from "~/app/_components/flex";
import { getBilibiliImageUrl } from "~/app/utils";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";
import { type UserHomeProps } from "../user/[id]/_components/user-home";

export const VideoCard = ({
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

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(num >= 10000 ? 0 : 1) + "K";
  } else {
    return num.toString();
  }
};
