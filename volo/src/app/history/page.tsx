import { Card, Container, List, ListItem, Typography } from "@mui/joy";
import { db } from "~/server/db";
import { VideoCard } from "../_components/video-card";

export default async function HistoryPage() {
  const videos = await db.video.findMany({ take: 10 });

  return (
    <Container>
      <List>
        {videos.map((video) => (
          <ListItem key={video.id} sx={{ height: 200 }}>
            <Typography>{video.createdAt.toISOString()}</Typography>
            <VideoCard video={video} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
