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
  Button,
  DialogContent,
  Divider,
  DialogTitle,
  DialogActions,
  Link as JoyLink,
} from "@mui/joy";
import { getBilibiliImageUrl } from "~/app/utils";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
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
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const { data: collections } = api.collection.myCollections.useQuery();

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <Typography
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            选择收藏夹
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
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
                <ListItemButton>
                  <ListItemDecorator>
                    <Checkbox />
                  </ListItemDecorator>
                  <ListItemContent>{collection.name}</ListItemContent>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button variant="solid" color="success" onClick={() => {}}>
            确认
          </Button>
          <Button variant="plain" color="neutral" onClick={onClose}>
            取消
          </Button>
        </DialogActions>
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
  return (
    <Stack spacing={2} p={2} data-joy-color-scheme="dark">
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
      <Typography level="body-md">{video.description}</Typography>
    </Stack>
  );
};

export interface VideoWithOverlayProps {
  video: VideoDetailedPublic;
  active: boolean;
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
