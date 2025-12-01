import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChallengeService } from '../../service/challenge.service';
import { CommonModule } from '@angular/common'; // ⭐⭐⭐ הוספת NgClass מ-@angular/common

@Component({
  selector: 'app-challenge-like',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './challenge-like.component.html',
  styleUrl: './challenge-like.component.css'
})
export class ChallengeLikeComponent implements OnInit, OnChanges {
// ⭐ קלט: מזהה האתגר (חובה)
  @Input() challengeId!: number; 
  
  // ⭐ קלט (אופציונלי): המצב ההתחלתי של הלייק (האם המשתמש נתן לייק)
  @Input() initialIsLiked: boolean = false;
  
  // ⭐ קלט (אופציונלי): ספירת הלייקים ההתחלתית 
  @Input() initialLikeCount: number = 0; 
@Output() likeStatusChanged = new EventEmitter<{newCount: number, isLiked: boolean}>();
  // משתני מצב פנימיים
  isLiked: boolean = false;
  likeCount: number = 0;
  isProcessing: boolean = false;
  message: string | null = null; 

  constructor(private challengeService: ChallengeService) { }

  ngOnInit(): void {
    // אתחול המצב הפנימי מהקלט
    this.isLiked = this.initialIsLiked;
    this.likeCount = this.initialLikeCount;
  }
// ⭐⭐ הוספת הפונקציה הקריטית לפתרון סנכרון מצב חוזר ⭐⭐
    ngOnChanges(changes: SimpleChanges): void {
        // בודק אם ה-Input של isLiked השתנה
        if (changes['initialIsLiked'] && !changes['initialIsLiked'].isFirstChange()) {
            this.isLiked = changes['initialIsLiked'].currentValue;
        }
        // בודק אם ה-Input של likeCount השתנה
        if (changes['initialLikeCount'] && !changes['initialLikeCount'].isFirstChange()) {
            this.likeCount = changes['initialLikeCount'].currentValue;
        }
    }
  /**
   * מטפל בלוגיקת ה-TOGGLE לייק.
   * קורא לשירות ומעדכן את המצב.
   */
  public onToggleLike(): void {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.message = null; 

 // ⭐⭐ 2. שמירת המצב הקודם ל-Rollback ⭐⭐
    const previousIsLiked = this.isLiked;
    const previousLikeCount = this.likeCount;

  console.log(`[LIKE] לחיצה. מצב קודם: isLiked=${previousIsLiked}, count=${previousLikeCount}`);

    this.challengeService.addLikeChallenge(this.challengeId).subscribe({
      next: () => {
        this.isProcessing = false;
        this.isLiked = !previousIsLiked; 
        this.likeCount = this.isLiked ? previousLikeCount + 1 : previousLikeCount - 1;
        console.log(`[LIKE] הצלחה (200 OK). מצב חדש: isLiked=${this.isLiked}, count=${this.likeCount}`);
        // ⭐⭐ 4. שידור השינוי לרכיב האב ⭐⭐
        this.likeStatusChanged.emit({ 
            newCount: this.likeCount, 
            isLiked: this.isLiked 
        });
      },
      error: (error) => {
        // ⭐⭐ 5. במקרה של שגיאה - גלגול לאחור והצגת הודעה ⭐⭐
       this.isLiked = previousIsLiked;
        this.likeCount = previousLikeCount;
        this.isProcessing = false;
        
        const status = error.status; 
        
        switch (status) {
          case 400: 
            this.message = 'שגיאה: אינך יכול לעשות לייק לאתר שאתה יצרת.';
            break;
          case 401: 
            this.message = 'שגיאה: אינך מחובר.';
            break;
          case 403: 
            this.message = ' עליך להצטרף לאתגר כדי לתת לייק.'; 
            break;
          case 404: 
            this.message = 'שגיאה: אתגר לא נמצא.';
            break;
          default:
            this.message = 'אירעה שגיאה. נסה שוב מאוחר יותר.';
            break;
        }
        // ⭐⭐ תיקון: מנקה את ההודעה לאחר 5 שניות ⭐⭐
        if (this.message) {
            setTimeout(() => {
                this.message = null;
            }, 5000); // ההודעה תופיע ל-5 שניות
        }
        console.error(`[LIKE] שגיאה! סטטוס: ${error.status}, הודעה: ${this.message}`);
      }
    });
  }
}