export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: string;
  averageRating?: number;
  imageUrl?: string;
}
