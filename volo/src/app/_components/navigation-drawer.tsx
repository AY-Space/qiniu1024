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
import { api } from "~/trpc/react";
import { useStore } from "../store";
import { useSession } from "next-auth/react";
import { type Recommendation } from "~/server/api/routers/gorse";

export type NavigationDrawer = Pick<DrawerProps, "open" | "onClose">;

export function NavigationDrawer({ open, onClose }: NavigationDrawer) {
  const session = useSession();
  const { data: categories } = api.tag.categories.useQuery();
  const {
    category: selectedCategory,
    setCategory: setSelectedCategory,
    recommendationType,
    setRecommendationType,
  } = useStore((state) => state);

  const recommendationTypes = {
    ...(session.status === "authenticated" && {
      recommendation: "推荐",
    }),
    popular: "热门",
    latest: "最新",
  } as Record<Recommendation, string>;

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
            {Object.entries(recommendationTypes).map(([k, v]) => (
              <Grid key={k} xs={6}>
                <Card>
                  <Radio
                    overlay
                    checked={k === recommendationType}
                    label={v}
                    sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
                    onClick={() => setRecommendationType(k as Recommendation)}
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
                    checked={category == selectedCategory}
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
