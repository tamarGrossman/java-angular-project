import { Component, OnInit } from '@angular/core'; // ✅ הוספת OnInit
import { ActivatedRoute, Router } from '@angular/router';
// ✅ הוספת האופרטורים הנדרשים לטיפול בשמות האתגרים
import { catchError, of, switchMap, forkJoin, map } from 'rxjs'; 
import { CommentService } from '../../service/comment.service';
import { Comment } from '../../models/comment.model';
import { DatePipe } from '@angular/common';
import { ChallengeService } from '../../service/challenge.service';
import { Challenge } from '../../models/challenge.model'; // 💡 ייבוא Challenge
import { RouterModule } from '@angular/router';
// 🎯 הגדרת הטיפוס המורחב - חייבת להישאר!
type CommentWithChallengeName = Comment & { challengeName: string };

@Component({
  selector: 'app-user-comments',
  imports: [DatePipe,RouterModule], // DatePipe נחוץ כ-import ב-standalone
  standalone: true,
  templateUrl: './user-comments.component.html',
  styleUrl: './user-comments.component.css'
})
export class UserCommentsComponent implements OnInit { // ✅ מימוש OnInit

  // ✅ תיקון קריטי: הגדרת המערך עם הטיפוס המורחב
  userComments: CommentWithChallengeName[] = []; 
  
  isLoading = true;
  error: string | null = null;
  currentUserId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private challengeService: ChallengeService
  ) { }

  ngOnInit(): void {
    this.loadUserComments();
  }

  // ✅ הוספת הפונקציה loadUserComments עם לוגיקת ה-forkJoin
  loadUserComments(): void {
    this.isLoading = true;
    this.commentService.getUserComments().pipe(
      switchMap(comments => {
        if (comments.length === 0) {
          return of([]);
        }

        const challengeRequests = comments.map(comment => {
          return this.challengeService.getChallengeById(comment.challengeId).pipe(
            map((challenge: Challenge) => ({
              ...comment, 
              challengeName: challenge.name
            })),
            catchError(err => {
              console.warn(`Challenge with ID ${comment.challengeId} not found.`);
              return of({ 
                ...comment, 
                challengeName: 'אתגר נמחק או לא נמצא' 
              } as CommentWithChallengeName);
            })
          );
        });

        return forkJoin(challengeRequests);
      }),
      catchError(err => {
        this.error = this.handleError(err);
        this.isLoading = false;
        return of([]); 
      })
    ).subscribe({
      next: (commentsWithNames) => {
        this.userComments = commentsWithNames as CommentWithChallengeName[];
        this.isLoading = false;
      },
      error: (err) => {
        // שגיאה כללית
      }
    });
  }

  /**
   * navigates the user to the details page of the challenge
   * @param challengeId ID of the challenge to navigate to
   */
  navigateToChallengeDetails(challengeId: number): void {
    this.router.navigate(['/challenge/details', challengeId]);
  }

  private handleError(err: any): string {
    // ... לוגיקת הטיפול בשגיאות נשארת זהה
    if (err.status === 403) {
      return 'אינך מורשה לצפות בתגובות אלו. (403)';
    } else if (err.status === 401) {
      return 'נדרשת התחברות לצפייה בתגובות. (401)';
    } else if (err.status === 204 || (err.status >= 400 && err.status < 500)) {
      return 'עדיין לא פורסמו תגובות על ידי משתמש זה.';
    } else {
      return 'אירעה שגיאה בשרת בעת שליפת התגובות.';
    }
  }
}