export interface Comment {
    id: number;
    userId: number;
    userName: string; // או long אם תמיד חייב להיות ערך
    content: string;
    picture: string;
    date: Date; //תאריך העלאת התגובה
    challengeId: number; // מזהה האתגר שאליו שייכת התגובה
    imagePath?: string;

}
