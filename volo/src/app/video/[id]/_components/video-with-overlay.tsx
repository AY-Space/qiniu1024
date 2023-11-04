"use client";

import {
  Avatar,
  IconButton,
  type IconButtonProps,
  Stack,
  Typography,
  ModalDialog,
  Modal,
  List,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  ListItemContent,
  Checkbox,
  DialogContent,
  Divider,
  Link as JoyLink,
  ModalClose,
  DialogTitle,
  LinearProgress,
  Chip,
} from "@mui/joy";
import { getBilibiliImageUrl } from "~/app/utils";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";
import { useMemo, useState } from "react";
import { Flex } from "~/app/_components/flex";
import { type VideoDetailedPublic } from "~/types";
import VideoPlayer from "./video-player";
import { CommentDrawer } from "./comment-drawer";
import { Add } from "@mui/icons-material";
import { CreateCollectionModal } from "~/app/_components/create-collection-modal";
import { api } from "~/trpc/react";
import Link from "next/link";

const VideoCollectionModal = ({
  open,
  onClose,
  videoId,
}: {
  open: boolean;
  onClose: () => void;
  videoId: string;
}) => {
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const utils = api.useUtils();
  const { data: collections } = api.collection.myCollections.useQuery();

  const { data: savedCollectionIds } = api.collection.idsWithVideo.useQuery({
    videoId,
  });
  const savedCollectionIdsSet = useMemo(
    () => new Set(savedCollectionIds ?? []),
    [savedCollectionIds],
  );
  const updateVideoCollection = api.collection.updateVideo.useMutation({
    onSuccess: async () => {
      await utils.collection.idsWithVideo.invalidate({ videoId });
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        {updateVideoCollection.isLoading && (
          <LinearProgress
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
        <Flex pb={0.5} alignItems="center">
          <DialogTitle
            sx={{
              flex: 1,
            }}
          >
            选择收藏夹
          </DialogTitle>
          <ModalClose
            sx={{
              position: "static",
            }}
          />
        </Flex>
        <Divider />
        <DialogContent sx={{ mb: 2 }}>
          <List>
            <ListItem>
              <ListItemButton onClick={() => setShowCreateCollection(true)}>
                <ListItemDecorator>
                  <Add />
                </ListItemDecorator>
                <ListItemContent>创建收藏夹</ListItemContent>
              </ListItemButton>
            </ListItem>
            {collections?.map((collection) => (
              <ListItem key={collection.id}>
                <Checkbox
                  label={collection.name}
                  overlay
                  checked={savedCollectionIdsSet.has(collection.id)}
                  onChange={(event) => {
                    updateVideoCollection.mutate({
                      collectionId: collection.id,
                      videoId,
                      operation: event.target.checked
                        ? "connect"
                        : "disconnect",
                    });
                  }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <CreateCollectionModal
          open={showCreateCollection}
          onClose={() => setShowCreateCollection(false)}
        />
      </ModalDialog>
    </Modal>
  );
};

const VideoActions = ({
  videoId,
  likes,
  comments,
  variant,
  active,
}: {
  videoId: string;
  likes: number;
  comments: number;
  variant: "side" | "overlay";
  active: boolean;
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  const buttonVariant: IconButtonProps["variant"] =
    variant === "overlay" ? "plain" : "soft";
  return (
    <Stack
      alignItems="center"
      sx={{
        position: variant === "overlay" ? "absolute" : "relative",
      }}
    >
      <Stack spacing={2}>
        <Stack alignItems="center">
          <IconButton size="lg" variant={buttonVariant}>
            <ThumbUpIcon />
          </IconButton>
          <Typography>{likes}</Typography>
        </Stack>
        <Stack alignItems="center">
          <IconButton
            size="lg"
            variant={buttonVariant}
            onClick={() => setShowComments(true)}
          >
            <CommentIcon />
          </IconButton>
          <Typography>{comments}</Typography>
          {active && (
            <CommentDrawer
              onClose={() => setShowComments(false)}
              open={showComments}
              videoId={videoId}
            />
          )}
        </Stack>
        <Stack alignItems="center">
          <IconButton
            size="lg"
            variant={buttonVariant}
            onClick={() => setShowCollection(true)}
          >
            <StarIcon />
          </IconButton>
          <Typography>收藏</Typography>
          {active && (
            <VideoCollectionModal
              open={showCollection}
              onClose={() => setShowCollection(false)}
              videoId={videoId}
            />
          )}
        </Stack>
        <Stack alignItems="center">
          <IconButton size="lg" variant={buttonVariant}>
            <ShareIcon />
          </IconButton>
          <Typography>分享</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

const VideoOverlay = ({ video }: { video: VideoDetailedPublic }) => {
  const categories = video.tags.filter((tag) => tag.type === "Category");
  const tags = video.tags.filter((tag) => tag.type === "Tag");

  return (
    <Stack spacing={1} p={2} data-joy-color-scheme="dark">
      <Flex spacing={2} alignItems="center">
        <Link href={`/user/${video.author.id}`}>
          <Avatar
            src={
              video.author.avatarUrl !== null
                ? getBilibiliImageUrl(video.author.avatarUrl)
                : undefined
            }
          />
        </Link>
        <Stack>
          <Link href={`/user/${video.author.id}`} passHref>
            <JoyLink
              color="neutral"
              level="title-md"
              sx={(theme) => ({
                color: theme.palette.text.primary,
              })}
            >
              {video.author.name}
            </JoyLink>
          </Link>
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

export interface VideoWithOverlayProps {
  video: VideoDetailedPublic;
  active: boolean;
  currentUserId?: string;
}

export const VideoWithOverlay = ({ video, active }: VideoWithOverlayProps) => {
  return (
    <Flex
      id={`volo-video-${video.id}`}
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "calc(100vh - var(--volo-app-bar-height))",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        position: "relative",
        width: "100%",
        p: 2,
      }}
      spacing={2}
    >
      <VideoPlayer
        playing={active}
        src={video.url}
        loop
        overlay={<VideoOverlay video={video} />}
      />
      <VideoActions
        comments={video.comments}
        likes={video.likes}
        videoId={video.id}
        active={active}
        variant="side"
      />
    </Flex>
  );
};
