"use client";
import { api } from "~/trpc/react";
import { VideoGrid } from "~/app/_components/video-grid";

export const CollectionGrid = ({ collectionId }: { collectionId: string }) => {
  const { data: videos } = api.collection.videos.useQuery({ collectionId });
  return videos && <VideoGrid videos={videos} />;
};
