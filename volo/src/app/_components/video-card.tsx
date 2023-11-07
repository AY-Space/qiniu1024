"use client";
import { Box, Card, CardContent, CardCover, Typography } from "@mui/joy";
import { Flex } from "~/app/_components/flex";
import { formatNumber } from "~/app/utils";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";
import { type UserHomeProps } from "../user/[id]/_components/user-home";

export const VideoCard = ({
  video,
  height,
}: {
  video: UserHomeProps["uploadedVideos"][0];
  height?: string;
}) => {
  return (
    <Link href={`/video/${video.id}`}>
      <Card
        sx={{
          aspectRatio: 4 / 3,
          height: height,
        }}
        data-joy-color-scheme="dark"
      >
        <CardCover>
          <Box
            sx={{
              borderRadius: "lg",
              backgroundImage: `url(${video.coverUrl})`,
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
