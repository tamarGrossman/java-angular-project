import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChallengeService } from '../../service/challenge.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-challenge-like',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './challenge-like.component.html',
  styleUrls: ['./challenge-like.component.css']  // <-- שים לב: styleUrls (ברשימה)
})
export class ChallengeLikeComponent implements OnInit, OnChanges {
  @Input() challengeId?: number;
  @Input() initialIsLiked: boolean = false;
  @Input() initialLikeCount: number = 0;
  
  @Output() likeStatusChanged = new EventEmitter<{newCount: number, isLiked: boolean}>();

  isLiked: boolean = false;
  likeCount: number = 0;
  isProcessing: boolean = false;
  message: string | null = null;

  // ⭐ הוספתי את ChangeDetectorRef (cdr) כדי לכפות עדכון תצוגה
  constructor(
    private challengeService: ChallengeService,
    private cdr: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
    this.isLiked = this.initialIsLiked;
    this.likeCount = this.initialLikeCount;
  }

  // ⭐⭐ תיקון קריטי: הפונקציה הזו הייתה שבורה בקוד שלך! ⭐⭐
  ngOnChanges(changes: SimpleChanges): void {
    // אם האבא מעביר נתונים חדשים, הבן חייב להתעדכן מיד
    if (changes['initialIsLiked']) {
      this.isLiked = changes['initialIsLiked'].currentValue;
    }
    if (changes['initialLikeCount']) {
      this.likeCount = changes['initialLikeCount'].currentValue;
    }
    // כפיית עדכון תצוגה ליתר ביטחון
    this.cdr.detectChanges();
  }

  public onToggleLike(): void {
    if (this.isProcessing) return;
    if (this.challengeId === undefined || this.challengeId === null) return;

    this.isProcessing = true;
    this.message = null;

    // שליחה לשרת
    this.challengeService.addLikeChallenge(this.challengeId).subscribe({
      next: (res) => {
        // קבלת הנתונים האמיתיים מהשרת
        const serverIsLiked = !!res.liked;
        const serverCount = Number(res.likeCount);

        // עדכון המשתנים המקומיים
        if (!isNaN(serverCount)) {
          this.likeCount = serverCount;
        }
        this.isLiked = serverIsLiked;

        // שליחת עדכון לאבא (כדי שיסנכרן את שאר המערכת)
        this.likeStatusChanged.emit({ newCount: this.likeCount, isLiked: this.isLiked });

        this.isProcessing = false;
        
        // ⭐⭐ הקסם: הפקודה הזו אומרת לאנגולר "תרענן את המספרים על המסך עכשיו!" ⭐⭐
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isProcessing = false;
        
        // הצגת שגיאות
        const serverMsg = error.error?.message || error.error || null;
        switch (error.status) {
          case 400: this.message = serverMsg || 'פעולה לא חוקית.'; break;
          case 401: this.message = serverMsg || 'יש להתחבר.'; break;
          case 403: this.message = serverMsg || 'יש להצטרף לאתגר.'; break;
          default: this.message = serverMsg || 'שגיאה כללית.';
        }
        
        if (this.message) setTimeout(() => {
           this.message = null;
           this.cdr.detectChanges(); // רענון כדי להעלים את ההודעה
        }, 4000);
        
        console.error('[LIKE] error', error);
        this.cdr.detectChanges(); // רענון כדי להציג את השגיאה
      }
    });
  }
}

