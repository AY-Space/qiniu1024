"use client";

import {
  Divider,
  Drawer,
  type DrawerProps,
  List,
  Typography,
  DialogTitle,
  Card,
  Grid,
  Radio,
  DialogContent,
} from "@mui/joy";
import { useState } from "react";
import { api } from "~/trpc/react";

export type NavigationDrawer = Pick<DrawerProps, "open" | "onClose">;

export function NavigationDrawer({ open, onClose }: NavigationDrawer) {
  const { data: categories } = api.tag.categories.useQuery();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  return (
    <Drawer open={open} onClose={onClose}>
      <DialogTitle>Title</DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 1.3 }}>
        <List>
          <Typography level="title-lg">分类</Typography>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            p={2}
          >
            {categories?.map((category) => (
              <Grid key={category.id} xs={6}>
                <Card>
                  <Radio
                    overlay
                    checked={category.id === selectedCategoryId}
                    label={category.name}
                    sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
                    onClick={() =>
                      setSelectedCategoryId(
                        category.id === selectedCategoryId ? null : category.id,
                      )
                    }
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </List>
      </DialogContent>
    </Drawer>
  );
}
