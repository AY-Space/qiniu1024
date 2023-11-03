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
import { CommentDrawer } from "~/app/video/[id]/_components/comment-drawer";
import { Add } from "@mui/icons-material";
import { CreateCollectionModal } from "~/app/_components/create-collection-modal";

const VideoControls = ({
  videoId,
  likes,
  comments,
  variant,
  onLike,
  onComment,
  onCollection,
}: {
  videoId: string;
  likes: number;
  comments: number;
  variant: "side" | "overlay";
  onLike: () => void;
  onComment: () => void;
  onCollection: () => void;
}) => {
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
          <span>{likes}</span>
        </Stack>
        <Stack alignItems="center">
          <IconButton size="lg" variant={buttonVariant} onClick={onComment}>
            <CommentIcon />
          </IconButton>
          <Typography>{comments}</Typography>
        </Stack>
        <Stack alignItems="center">
          <IconButton size="lg" variant={buttonVariant} onClick={onCollection}>
            <StarIcon />
          </IconButton>
          <Typography>收藏</Typography>
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
    <Stack spacing={2} p={2}>
      <Flex spacing={2} alignItems="center">
        <Avatar
          src={
            video.author.avatarUrl !== null
              ? getBilibiliImageUrl(video.author.avatarUrl)
              : undefined
          }
        />
        <Stack>
          <Typography level="title-md">{video.author.name}</Typography>
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
  const [showComments, setShowComments] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showCreateCollection, setShowCreateCollection] = useState(false);

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
      <VideoControls
        comments={video.comments}
        likes={video.likes}
        videoId={video.id}
        variant="side"
        onCollection={() => setShowCollection(true)}
        onComment={() => setShowComments(true)}
      />
      <CommentDrawer
        onClose={() => setShowComments(false)}
        open={showComments}
        videoId={video.id}
      />

      <Modal open={showCollection} onClose={() => setShowCollection(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <Typography
              component="h2"
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
                    <Add></Add>
                  </ListItemDecorator>
                  <ListItemContent>创建收藏夹</ListItemContent>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton>
                  <ListItemDecorator>
                    <Checkbox overlay onChange={() => {}} />
                  </ListItemDecorator>
                  <ListItemContent>收藏夹名</ListItemContent>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton>
                  <ListItemDecorator>
                    <Checkbox overlay onChange={() => {}} />
                  </ListItemDecorator>
                  <ListItemContent>收藏夹名</ListItemContent>
                </ListItemButton>
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="success"
              onClick={() => setShowCollection(false)}
            >
              确认
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setShowCollection(false)}
            >
              取消
            </Button>
          </DialogActions>
          <CreateCollectionModal
            showCreateCollection={showCreateCollection}
            setShowCreateCollection={setShowCreateCollection}
          />
        </ModalDialog>
      </Modal>
    </Flex>
  );
};
