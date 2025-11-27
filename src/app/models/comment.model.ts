// src/app/models/comment.model.ts

export interface Comment {
  id: number;
  username: string;
  userId: number;
  content: string;
  picture: string | null; // Base64 של התמונה
  date: string | null; // Angular יקבל מחרוזת (string)
  challengeId: number;
  imagePath: string | null;
}
