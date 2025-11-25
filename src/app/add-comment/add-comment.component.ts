import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentService } from '../service/comment.service';
import { Comment } from '../models/comment.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-comment',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css'
})
export class AddCommentComponent {
  
@Input() challengeId: number | undefined;  
  /** * פולט אירוע כשהתגובה נשמרת בהצלחה, כדי שההורה יטען מחדש את רשימת התגובות.
   */
  @Output() commentAdded = new EventEmitter<void>();

  // משתנה לקליטת תוכן התגובה מה-HTML
  commentContent: string = '';
  
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;

  constructor(private commentService: CommentService) { }

  /**
   * מטפל בתהליך איסוף הנתונים ושליחתם לשרת.
   */
submitComment(): void {
  // ודאי שה-ID קיים לפני השליחה
  if (!this.challengeId || !this.commentContent.trim()) {
    return;
  }
  
  this.isLoading = true;
  this.isError = false;
  this.message = ''; // איפוס הודעות קודמות

  const commentData = {
    content: this.commentContent,
    // אם יש לך תמונה/שדות נוספים, הוספי אותם כאן
  };

  this.commentService.addCommentToChallenge(this.challengeId, commentData)
    .subscribe({
      next: (response) => {
        // ✅ הצלחה: השרת החזיר 201
        this.message = 'התגובה הוספה בהצלחה! 🎉'; 
        this.isError = false;
        this.commentContent = ''; // איפוס תיבת הטקסט
        
        // שליחת אירוע לקומפוננטה ההורה
        this.commentAdded.emit(); // ⬅️ הורדתי את ה-true כי הפונקציה לא דורשת ערך
        
        // הסתרת הודעת ההצלחה לאחר 3 שניות (אופציונלי)
        setTimeout(() => {
          this.message = '';
        }, 3000); 
      },
      error: (err) => {
        // ❌ טיפול בשגיאה (אם השרת החזיר 400, 500, וכו')
        this.isError = true;
        this.message = `שגיאה בשליחת התגובה: ${err.error.message || 'נסה שוב'}`;
      },
      complete: () => {
        // רץ תמיד בסיום
        this.isLoading = false;
      }
    });
}}