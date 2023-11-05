"use client";

import {
  Avatar,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  Typography,
} from "@mui/joy";
import { Flex } from "~/app/_components/flex";
import { getBilibiliImageUrl } from "~/app/utils";
import { type VideoPublic, type UserDetailedPublic } from "~/types";
import { VideoTabPanel } from "./video-tab-panel";
import { LikeTabPanel } from "./like-tab-panel";
import { CollectionTabPanel } from "./collection-tab-panel";
import { useSession } from "next-auth/react";
import { Edit, Upload } from "@mui/icons-material";
import { useState } from "react";
import { VisuallyHiddenInput } from "~/app/upload/page";
import ReactCrop, { type Crop } from "react-image-crop";

export interface UserHomeProps {
  user: UserDetailedPublic;
  uploadedVideos: VideoPublic[];
}

export const UserHome = ({ user, uploadedVideos }: UserHomeProps) => {
  const { data: session } = useSession();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const isSelf = session?.userId === user.id;

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
          <Typography
            level="h1"
            endDecorator={
              isSelf && (
                <IconButton onClick={() => setShowEditDialog(true)}>
                  <Edit />
                </IconButton>
              )
            }
          >
            {user.name}
          </Typography>
          <Typography>{`${user.followers} 粉丝数 · ${user.following} 关注数`}</Typography>
          <Typography>{user.bio ?? "没有写简介的说～"}</Typography>
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
        <TabPanel value={0}>
          <VideoTabPanel videos={uploadedVideos} />
        </TabPanel>
        <TabPanel value={1}>
          <LikeTabPanel userId={user.id} />
        </TabPanel>
        <TabPanel value={2}>
          <CollectionTabPanel userId={user.id} />
        </TabPanel>
      </Tabs>

      <EditDialog
        user={user}
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
      />
    </Stack>
  );
};
function EditDialog({
  user,
  open,
  onClose,
}: {
  user: UserDetailedPublic;
  open: boolean;
  onClose: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file ?? null);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>修改信息</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack>
            <Stack alignItems="center" gap={1}>
              <Avatar
                src={
                  user.avatarUrl
                    ? getBilibiliImageUrl(user.avatarUrl)
                    : undefined
                }
                sx={{
                  "&": {
                    "--Avatar-size": "72px",
                  },
                }}
              />
              <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="outlined"
                color="neutral"
                startDecorator={<Upload />}
              >
                选择头像
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </Button>
            </Stack>
            <FormControl>
              <FormLabel>名称</FormLabel>
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>简介</FormLabel>
              <Textarea minRows={2} />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>确认</Button>
          <Button variant="plain" onClick={onClose}>
            取消
          </Button>
        </DialogActions>
        <CropDialog
          open={selectedFile !== null}
          onClose={() => setSelectedFile(null)}
        />
      </ModalDialog>
    </Modal>
  );
}

function CropDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [crop, setCrop] = useState<Crop>();
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>裁剪图片</DialogTitle>
        <Divider />
        <DialogContent>
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)}></ReactCrop>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>确认</Button>
          <Button variant="plain" onClick={onClose}>
            取消
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
