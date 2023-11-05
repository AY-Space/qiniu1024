"use client";
import {
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
  ModalClose,
  DialogTitle,
  LinearProgress,
} from "@mui/joy";
import { useMemo, useState } from "react";
import { Flex } from "~/app/_components/flex";
import { Add } from "@mui/icons-material";
import { CreateCollectionModal } from "~/app/_components/create-collection-modal";
import { api } from "~/trpc/react";

export const VideoCollectionModal = ({
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
