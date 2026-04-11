export type Bookmark = {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  tags: string[];
  userId: number;
};
