"use client";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Divider,
  Snackbar,
} from "@mui/joy";
import { Add, VideoLibrary } from "@mui/icons-material";
import { useState } from "react";
import { CreateCollectionModal } from "~/app/_components/create-collection-modal";
import { api } from "~/trpc/react";
import { CollectionGrid } from "../../../_components/collection-grid";
import { Flex } from "~/app/_components/flex";
import { useRouter } from "next/navigation";

export const CollectionTabPanel = () => {
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const utils = api.useUtils();
  const router = useRouter();

  const {
    data: collections,
    error,
    isLoading,
  } = api.collection.myCollections.useQuery();

  const deleteCollection = api.collection.delete.useMutation({
    onSuccess: async () => {
      await utils.collection.myCollections.invalidate();
      setDeleteSuccess(true);
      router.refresh();
    },
    onError: () => setDeleteError(true),
  });

  return (
    <>
      <Tabs aria-label="Vertical tabs" orientation="vertical">
        <TabList>
          <Button
            variant="plain"
            startDecorator={<Add />}
            onClick={() => setShowCreateCollection(true)}
          >
            创建
          </Button>
          {error && <Alert color="danger">加载失败</Alert>}
          {isLoading && (
            <Tab>
              <CircularProgress size="sm" />
              加载中
            </Tab>
          )}
          {collections?.map((collection) => (
            <Tab key={collection.id}>
              <VideoLibrary />
              {collection.name}
            </Tab>
          ))}
        </TabList>

        {collections != undefined
          ? collections.map((collection, index) => (
              <TabPanel value={index} key={collection.id}>
                <Flex gap={1} px={1} direction="row-reverse">
                  <Button
                    onClick={() => {
                      deleteCollection.mutate({ collectionId: collection.id });
                    }}
                  >
                    删除收藏夹
                  </Button>
                </Flex>
                <Divider sx={{ m: 1 }} />
                <CollectionGrid collectionId={collection.id} />
              </TabPanel>
            ))
          : !isLoading && <Typography textAlign="center">无数据</Typography>}
      </Tabs>
      <CreateCollectionModal
        open={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
      />
      <Snackbar
        variant="solid"
        color="success"
        autoHideDuration={1600}
        open={deleteSuccess}
        onClose={() => setDeleteSuccess(false)}
      >
        删除成功
      </Snackbar>
      <Snackbar
        variant="solid"
        color="danger"
        autoHideDuration={1600}
        open={deleteError}
        onClose={() => setDeleteError(false)}
      >
        删除失败
      </Snackbar>
    </>
  );
};
