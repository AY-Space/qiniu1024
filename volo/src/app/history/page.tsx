import { Card, Container, List, ListItem, Typography } from "@mui/joy";
import { db } from "~/server/db";
import { VideoCard } from "../_components/video-card";

export default async function HistoryPage() {
  const videos = await db.video.findMany({ take: 10 });

  return (
    <Container
      sx={{
        height: "calc(100vh - var(--volo-app-bar-height))",
      }}
    >
      <List>
        {videos.map((video) => (
          <ListItem key={video.id}>
            <Card sx={{ height: 200, display: "flex" }}>
              <Typography>{video.createdAt.toISOString()}</Typography>
              <VideoCard video={video} />
            </Card>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
