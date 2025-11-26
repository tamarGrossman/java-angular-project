import { Component, EventEmitter, Input, Output } from '@angular/core';
// ⬅️ הוסף את HttpErrorResponse לטיפול בשגיאות
import { HttpErrorResponse } from '@angular/common/http'; 
import { CommentService } from '../service/comment.service';
// ⬅️ ניתן להחליף את Comment ב-any אם המודל לא נחוץ כאן
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
  @Output() commentAdded = new EventEmitter<void>();

  commentContent: string = '';
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
selectedFile: File | null = null; // ✅ שדה חדש לטיפול בקובץ

  constructor(private commentService: CommentService) { }

  /**
   * מטפל בלוגיקה של הצלחה (קריאה מה-next או מה-error handler המטפל ב-201).
   */
handleSuccess(): void {
    console.log('1. [ADD_COMMENT] START HANDLE SUCCESS: Setting message.');
    this.message = 'התגובה הוספה בהצלחה! 🎉'; 
    this.isError = false;
    this.commentContent = ''; // איפוס תיבת הטקסט
    
    // ✅ 1. הפצת האירוע באופן מיידי!
    console.log('2. [ADD_COMMENT] EMITTING EVENT: Telling parent to refresh comments list.');
    this.commentAdded.emit(); 
    
    // 2. הטיימר נשאר רק בשביל להסתיר את ההודעה בתוך רכיב הילד.
    setTimeout(() => {
      this.message = ''; // הסתרת ההודעה לאחר 3 שניות
      console.log('3. [ADD_COMMENT] TIMER ENDED: Hiding message after 3 seconds.');
    }, 3000); 
  }
  /**
   * מטפל בתהליך איסוף הנתונים ושליחתם לשרת.
   */
  onFileSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = null;
    }
  }

  /**
   * ✅ עדכון: בונה את ה-FormData ושולח לשרת.
   */
  submitComment(): void {
    // ודאי שה-ID קיים, התוכן קיים וקובץ נבחר
    if (!this.challengeId || !this.commentContent.trim() || !this.selectedFile) {
      this.isError = true;
      this.message = 'אנא מלאו תוכן תגובה ובחרו קובץ תמונה.';
      console.log('4. [ADD_COMMENT] SUBMIT STARTED: Building FormData for Challenge ID:', this.challengeId);
      return;
    }
  
    this.isLoading = true;
    this.isError = false;
    this.message = ''; 

    // 1. בניית ה-FormData
    const formData = new FormData();

    // 2. הכנת ה-JSON (ה-CommentDto)
    const commentDataDto = {
        content: this.commentContent,
        // ניתן להוסיף כאן שדות נוספים מתוך ה-CommentDto אם נדרשים
    };

    // 3. הוספת ה-JSON כ-BLOB (חלק ה-"commentData")
    // ✅ שימוש ב-Blob עם Content-Type: application/json פותר בעיות 415 רבות!
    const commentBlob = new Blob([JSON.stringify(commentDataDto)], { type: 'application/json' });
    formData.append('commentData', commentBlob); // ⬅️ KEY חייב להיות 'commentData'

    // 4. הוספת הקובץ (חלק ה-"image")
    formData.append('image', this.selectedFile, this.selectedFile.name); // ⬅️ KEY חייב להיות 'image'
    
    // ⬅️ המבנה התקין של הקריאה ל-subscribe
    this.commentService.addCommentToChallenge(this.challengeId, formData)
      .subscribe({
        next: (res: any) => { // ✅ תיקון: הגדרת סוג (או any)
           console.log('✅ SUCCESS BLOCKED: Response received in next block', res);
           this.handleSuccess();
        },
        error: (err: HttpErrorResponse) => { // ✅ תיקון: הגדרת הסוג
          const status = err.status;
          
          if (status === 201 || status === 200 || status === 0) { 
            // טיפול בשגיאת פרסור/CORS המופיעה כשה-Backend שולח 201 ללא Body
            this.handleSuccess();
          } else {
            // ❌ שגיאה אמיתית (4xx, 5xx)
            this.isError = true;
            const errorMessage = err.error?.message || err.message || `סטטוס: ${status}. שגיאת שרת לא ידועה.`;
            this.message = `שגיאה בשליחת התגובה: ${errorMessage}`;
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}