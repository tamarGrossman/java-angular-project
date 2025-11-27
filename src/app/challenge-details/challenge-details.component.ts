// src/app/components/challenge-details/challenge-details.component.ts

import { Component, OnInit } from '@angular/core';
import { Challenge } from '../models/challenge.model';
import { ChallengeService } from '../service/challenge.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// ⬅️ ייבוא קומפוננטת התגובה החדשה
import { AddCommentComponent } from '../add-comment/add-comment.component'; 
// ייבוא הנדרש עבור routerLink אם לא מיובא דרך RouterModule
import { RouterLink } from '@angular/router'; 
import { CommentService } from '../service/comment.service';
import { Comment } from '../models/comment.model';

@Component({
  selector: 'app-challenge-details',
  // ⬅️ חובה להוסיף את AddCommentComponent ו-RouterLink ל-imports
  imports: [CommonModule, RouterModule, AddCommentComponent, RouterLink], 
  standalone: true,
  templateUrl: './challenge-details.component.html',
  styleUrl: './challenge-details.component.css'
})
export class ChallengeDetailsComponent implements OnInit {
  challenge: Challenge | undefined;
  challengeId: number = 0;
  isLoading: boolean = true;
  isJoining: boolean = false; 
comments: Comment[] = [];
  

  // ⬅️ משתנה חדש לשליטה בהצגת הטופס
  showCommentForm: boolean = true; 
  refreshTrigger: number = 0;

  constructor(
    private commentService: CommentService,  
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private router: Router
  ) { }
ngOnInit(): void {
    
    // 1. קבלת ה-ID מתוך ה-URL (שימוש ב-subscribe לטיפול בשינויים עתידיים ב-URL)
    this.route.params.subscribe(params => {
      
      const idParam = params['id'] || params['challengeId']; // בודק גם 'id' וגם 'challengeId'

      if (idParam) {
        this.challengeId = +idParam;
        
        // 2. קריאה לטעינת נתונים
        this.getChallengeDetails();
        this.loadComments(); // 💡 קריאה לטעינת תגובות ברגע שה-ID קיים
      } else {
        console.error('Challenge ID not found in URL');
        this.isLoading = false;
      }
    });
  } // סוף ngOnInit מאוחד

  getChallengeDetails(): void {
    this.challengeService.getChallengeById(this.challengeId).subscribe({
      next: (data) => {
        this.challenge = data;
        this.isLoading = false;
        // 💡 ניתן להוסיף כאן טעינת תגובות קיימות
      },
      error: (err) => {
        console.error('Failed to load challenge details', err);
        this.isLoading = false;
      }
    });
  }
  
  // ⬅️ פונקציה חדשה: מציגה/מסתירה את הטופס
  toggleCommentForm(): void {
    this.showCommentForm = !this.showCommentForm;
  }

  // ⬅️ פונקציה חדשה: מטפלת בהצלחת שליחת תגובה
  // ✅ תיקון 3: שינוי הלוגיקה ב-onCommentAddedSuccess()
  onCommentAddedSuccess(): void {
    
    // ✅ 1. קריאה חוזרת לשרת:
    // הפונקציה loadComments מביאה את כל רשימת התגובות המעודכנת (כולל החדשה)
    // ומחליפה את המערך this.comments.
    this.loadComments(); 
    
    console.log(`תגובה נוספה בהצלחה. מרענן את רשימת התגובות...`);
    
    // 2. עטיפת הסתרת הטופס ב-setTimeout (נשאר לטובת חווית משתמש טובה)
    setTimeout(() => {
        this.showCommentForm = false; // הסתרת הטופס לאחר 3 שניות
        console.log('מסתיר את טופס התגובה לאחר 3 שניות.');
    }, 3000); 
    
    // ניתן להסיר את this.refreshTrigger++ ו-console.log הקשורים לטריגר אם את כבר לא משתמשת בו.
}

  // --- הפונקציה החדשה: הצטרפות לאתגר ---
  joinChallenge(): void {
    if (this.isJoining || !this.challengeId) {
      return; // ⬅️ מונע לחיצות כפולות
    }

    this.isJoining = true;

    // הפונקציה בסרוויס משתמשת כבר ב-{withCredentials: true}
    // וה-Backend מחלץ את ה-User ID מה-Cookie/Token המאומת.
    this.challengeService.joinChallenge(this.challengeId).subscribe({
      next: (response) => {
        alert('הצטרפת לאתגר בהצלחה!');
        console.log('Join Success:', response);
        this.isJoining = false;
        // 💡 ניווט לרשימת האתגרים שלי או רענון הדף
        this.router.navigate(['/my-challenges']); 
      },
      error: (err) => {
        this.isJoining = false;
        const errorMessage = err.error || 'שגיאה בהצטרפות. אנא ודא שאתה מחובר.';

        // טיפול בשגיאות נפוצות:
        if (err.status === 400 && errorMessage.includes('כבר הצטרף')) {
          alert('אתה כבר רשום לאתגר זה.');
        } else if (err.status === 401 || err.status === 403) {
           alert('עליך להתחבר כדי להצטרף לאתגר.');
        } else {
          alert(`שגיאה בהצטרפות: ${errorMessage}`);
        }
        console.error('Join Error:', err);
      }
    });
  }

  loadComments(): void {
    // קורא לשירות ושומר את התגובות במשתנה 'comments'
    this.commentService.getCommentsByChallengeId(this.challengeId)
      .subscribe({
        next: (data) => {
          this.comments = data;
          console.log('Comments loaded:', data);
        },
        error: (e) => {
          console.error('Error fetching comments:', e);
          // ניתן להציג כאן הודעה למשתמש
        }
      });
  }
}

