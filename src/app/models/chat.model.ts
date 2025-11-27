export interface Message {
  content: string;
  isUser: boolean; // נכון עבור המשתמש, שקר עבור הבוט
}