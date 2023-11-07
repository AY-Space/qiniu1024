"use client";
import { Avatar, Stack, Typography, Link as JoyLink, Chip } from "@mui/joy";
import { Flex } from "~/app/_components/flex";
import { type VideoDetailedPublic } from "~/types";
import Link from "next/link";
import { FollowButton } from "~/app/_components/follow-button";
import { useSession } from "next-auth/react";

export const VideoOverlay = ({ video }: { video: VideoDetailedPublic }) => {
  const { data: session } = useSession();
  const categories = video.tags.filter((tag) => tag.type === "Category");
  const tags = video.tags.filter((tag) => tag.type === "Tag");

  return (
    <Stack spacing={1} p={2}>
      <Flex spacing={2} alignItems="center">
        <Link href={`/user/${video.author.id}`}>
          <Avatar src={video.author.avatarUrl ?? undefined} />
        </Link>
        <Stack>
          <Flex alignItems="center" gap={1}>
            <Link
              href={`/user/${video.author.id}`}
              style={{
                color: "var(--joy-palette-text-primary)",
              }}
            >
              <JoyLink
                level="title-md"
                color="neutral"
                sx={{
                  color: "var(--joy-palette-text-primary)",
                }}
                component="span"
              >
                {video.author.name}
              </JoyLink>
            </Link>
            <Stack
              sx={{
                opacity: 0.7,
              }}
            >
              {session?.userId != video.author.id && (
                <FollowButton followUserId={video.author.id} />
              )}
            </Stack>
          </Flex>
          <Typography level="body-xs">
            {video.createdAt.toLocaleDateString()}
          </Typography>
        </Stack>
      </Flex>
      <Typography level="title-md">{video.title}</Typography>
      <Flex gap={1} flexWrap="wrap">
        {categories.map((category) => (
          <Chip key={category.id} size="sm" color="primary">
            {category.name}
          </Chip>
        ))}
        {tags.map((tag) => (
          <Chip key={tag.id} size="sm">
            {tag.name}
          </Chip>
        ))}
      </Flex>
      <Typography level="body-md" noWrap>
        {video.description}
      </Typography>
    </Stack>
  );
};
