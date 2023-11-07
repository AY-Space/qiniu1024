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
} from "@mui/joy";
import { Add, VideoLibrary } from "@mui/icons-material";
import { useState } from "react";
import { CreateCollectionModal } from "~/app/_components/create-collection-modal";
import { api } from "~/trpc/react";
import { CollectionGrid } from "../../../_components/collection-grid";

export const CollectionTabPanel = () => {
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const {
    data: collections,
    error,
    isLoading,
  } = api.collection.myCollections.useQuery();

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
          {collections != undefined && collections.length > 0 ? (
            collections.map((collection) => (
              <Tab key={collection.id}>
                <VideoLibrary />
                {collection.name}
              </Tab>
            ))
          ) : (
            <Typography textAlign="center">无数据</Typography>
          )}
        </TabList>

        {collections != undefined ? (
          collections.map((collection, index) => (
            <TabPanel value={index} key={collection.id}>
              <CollectionGrid collectionId={collection.id} />
            </TabPanel>
          ))
        ) : (
          <Typography textAlign="center">无数据</Typography>
        )}
      </Tabs>
      <CreateCollectionModal
        open={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
      />
    </>
  );
};
