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

ngOnChanges(changes: SimpleChanges): void {
  if (changes['initialIsLiked'] && !changes['initialIsLiked'].firstChange) {
    this.isLiked = changes['initialIsLiked'].currentValue;
  }
  if (changes['initialLikeCount'] && !changes['initialLikeCount'].firstChange) {
    this.likeCount = changes['initialLikeCount'].currentValue;
  }
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
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isProcessing = false;
        
        // הצגת שגיאות
        const serverMsg = error.error?.message || error.error || null;
        switch (error.status) {
          case 400: this.message = 'יש להצטרף לאתגר כדי לשים לייק'; break;
          case 401: this.message= 'יש להתחבר.'; break;
          case 403: this.message =  'יש להתחבר'; break;
          case 409: this.message =  'אינך יכול לעשות לייק לאתגר שאתה יצרת'; break;
          default: this.message = 'שגיאה כללית.';
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

