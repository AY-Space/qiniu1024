"use client";
import { Tab, TabList, TabPanel, Tabs, Button } from "@mui/joy";
import { Add, VideoLibrary } from "@mui/icons-material";
import { useState } from "react";
import { CreateCollectionModal } from "~/app/_components/create-collection-modal";
import { api } from "~/trpc/react";
import { VideoGrid } from "~/app/_components/video-tab-panel";

export const CollectionTabPanel = () => {
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const { data: collections } = api.collection.myCollections.useQuery();

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
          {collections?.map((collection) => (
            <Tab key={collection.id}>
              <VideoLibrary />
              {collection.name}
            </Tab>
          ))}
        </TabList>

        {collections?.map((collection, index) => (
          <TabPanel value={index} key={collection.id}>
            <CollectionGrid collectionId={collection.id} />
          </TabPanel>
        ))}
      </Tabs>
      <CreateCollectionModal
        open={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
      />
    </>
  );
};

const CollectionGrid = ({ collectionId }: { collectionId: string }) => {
  const { data: videos } = api.collection.videos.useQuery({ collectionId });
  return videos && <VideoGrid videos={videos} />;
};
