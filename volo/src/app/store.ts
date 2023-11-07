import { create } from "zustand";
import { type Recommendation } from "~/server/api/routers/gorse";

export const useStore = create<{
  recommendationType: Recommendation;
  category: string | null;
  setRecommendationType: (recommendationType: Recommendation) => void;
  setCategory: (categoryId: string | null) => void;
}>((set) => ({
  recommendationType: "popular",
  category: null,
  setRecommendationType: (recommendationType: Recommendation) =>
    set({ recommendationType }),
  setCategory: (category: string | null) => set({ category }),
}));
