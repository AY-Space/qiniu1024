"use client";

import {
  Divider,
  Drawer,
  type DrawerProps,
  Typography,
  DialogTitle,
  Card,
  Grid,
  Radio,
  DialogContent,
  Stack,
} from "@mui/joy";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

export type NavigationDrawer = Pick<DrawerProps, "open" | "onClose">;

export function NavigationDrawer({ open, onClose }: NavigationDrawer) {
  const { data: categories } = api.tag.categories.useQuery();
  const [selectedType, setSelectedType] = useState("推荐");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <Drawer open={open} onClose={onClose}>
      <DialogTitle>
        <Link href="/">
          <Typography level="body-lg">Volo</Typography>
        </Link>
      </DialogTitle>
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
              <Grid key={category} xs={6}>
                <Card>
                  <Radio
                    overlay
                    checked={category === selectedCategory}
                    label={category}
                    sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
                    onClick={() =>
                      setSelectedCategory(
                        category === selectedCategory ? null : category,
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
