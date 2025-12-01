import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { CommentService } from '../../service/comment.service';
import { Comment } from '../../models/comment.model';
import { DatePipe } from '@angular/common'; // 💡 ייבוא DatePipe


@Component({
  selector: 'app-user-comments',
  imports: [DatePipe ],
  standalone: true,
  templateUrl: './user-comments.component.html',
  styleUrl: './user-comments.component.css'
})
export class UserCommentsComponent {
userComments: Comment[] = [];
  isLoading = true;
  error: string | null = null;
  currentUserId!: number; 

  constructor(
    private route: ActivatedRoute,
    private router: Router, // ⬅️ הזרקת ה-Router
    private commentService: CommentService
  ) { }

ngOnInit(): void {
    // ✅ תיקון קריטי: מחליפים את כל לוגיקת ה-switchMap/params
    // המטרה היא לקרוא לפונקציה החדשה this.commentService.getMyComments()
    this.commentService. getUserComments()
      .subscribe({
        next: (comments: Comment[]) => {
          this.userComments = comments;
          this.isLoading = false;
        },
        error: (err: any) => {
          // ה-handleError עדיין שימושי לטיפול ב-403/401/204
          this.error = this.handleError(err);
          this.isLoading = false;
          console.error('Error fetching comments:', err);
        }
      });
  }

  /**
   * navigates the user to the details page of the challenge
   * @param challengeId ID of the challenge to navigate to
   */
  navigateToChallengeDetails(challengeId: number): void {
    // 🔑 נניח שנתיב פרטי האתגר הוא: '/challenge/details/:id'
    this.router.navigate(['/challenge/details', challengeId]);
  }

  private handleError(err: any): string {
     // פונקציית עזר לטיפול בהודעות שגיאה ספציפיות
     if (err.status === 403) {
          return 'אינך מורשה לצפות בתגובות אלו. (403)';
      } else if (err.status === 401) {
          return 'נדרשת התחברות לצפייה בתגובות. (401)';
      } else if (err.status === 204) {
          return 'עדיין לא פורסמו תגובות על ידי משתמש זה.';
      } else {
          return 'אירעה שגיאה בשרת בעת שליפת התגובות.';
      }
  }
}
