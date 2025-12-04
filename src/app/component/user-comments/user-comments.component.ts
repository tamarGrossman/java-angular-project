import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap, forkJoin, map } from 'rxjs'; 
import { CommentService } from '../../service/comment.service';
import { Comment } from '../../models/comment.model';
import { DatePipe } from '@angular/common';
import { ChallengeService } from '../../service/challenge.service';
import { Challenge } from '../../models/challenge.model'; 
import { RouterModule } from '@angular/router';
type CommentWithChallengeName = Comment & { challengeName: string };

@Component({
  selector: 'app-user-comments',
  imports: [DatePipe,RouterModule],
  standalone: true,
  templateUrl: './user-comments.component.html',
  styleUrl: './user-comments.component.css'
})

//תגובות שהעליתי

export class UserCommentsComponent implements OnInit {

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

 
   
  navigateToChallengeDetails(challengeId: number): void {
    this.router.navigate(['/challenge/details', challengeId]);
  }

  private handleError(err: any): string {
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