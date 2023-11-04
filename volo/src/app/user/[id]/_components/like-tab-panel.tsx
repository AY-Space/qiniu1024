"use client";
import { Grid, TabPanel } from "@mui/joy";

export const LikeTabPanel = ({
  userId,
  value,
}: {
  userId: string;
  value: number;
}) => {
  return (
    <TabPanel value={value}>
      <Grid
        container
        columns={{
          xs: 2,
          sm: 3,
          md: 4,
        }}
      ></Grid>
    </TabPanel>
  );
};
