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
  Stack,
} from "@mui/joy";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Flex } from "./flex";

export type NavigationDrawer = Pick<DrawerProps, "open" | "onClose">;

export function NavigationDrawer({ open, onClose }: NavigationDrawer) {
  const { data: categories } = api.tag.categories.useQuery();
  const [selectedType, setSelectedType] = useState("推荐");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  return (
    <Drawer open={open} onClose={onClose}>
      <DialogTitle>Volo</DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 1.3 }}>
        <Stack>
          <Typography level="title-lg">推荐类型</Typography>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            p={2}
          >
            {["推荐", "最新", "热门"].map((e) => (
              <Grid key={e} xs={6}>
                <Card>
                  <Radio
                    overlay
                    checked={e === selectedType}
                    label={e}
                    sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
                    onClick={() => setSelectedType(e)}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
        <Stack>
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
        </Stack>
      </DialogContent>
    </Drawer>
  );
}
