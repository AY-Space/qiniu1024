"use client";
import { Grid, Tab, TabList, TabPanel, Tabs, Button } from "@mui/joy";
import { Add, VideoLibrary } from "@mui/icons-material";
import { useState } from "react";
import { CreateCollectionModal } from "~/app/_components/create-collection-modal";

export const CollectionTabPanel = ({
  userId,
  value,
}: {
  userId: string;
  value: number;
}) => {
  const [showCreateCollection, setShowCreateCollection] = useState(false);

  return (
    <TabPanel value={value}>
      <Tabs
        aria-label="Vertical tabs"
        orientation="vertical"
        sx={{ minWidth: 300, height: 160 }}
      >
        <TabList>
          <Button
            variant="plain"
            startDecorator={<Add />}
            onClick={() => setShowCreateCollection(true)}
          >
            创建收藏夹
          </Button>
          <Tab sx={{ display: "flex", alignItems: "space-between" }}>
            <VideoLibrary />
            tab
          </Tab>
          <Tab>
            <VideoLibrary />
            Second tab
          </Tab>
          <Tab>
            <VideoLibrary />
            Third tab
          </Tab>
        </TabList>
        <TabPanel value={0}>
          <Grid
            container
            columns={{
              xs: 2,
              sm: 3,
              md: 4,
            }}
          ></Grid>
        </TabPanel>
        <TabPanel value={1}>
          <b>Second</b> tab panel
        </TabPanel>
        <TabPanel value={2}>
          <b>Third</b> tab panel
        </TabPanel>
      </Tabs>
      <CreateCollectionModal
        open={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
      />
    </TabPanel>
  );
};
