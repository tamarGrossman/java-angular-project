// src/app/components/challenge-details/challenge-details.component.ts

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Challenge } from '../../models/challenge.model';
import { ChallengeService } from '../../service/challenge.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { RouterLink } from '@angular/router';
import { CommentService } from '../../service/comment.service';
import { Comment } from '../../models/comment.model';
import { ChallengeLikeComponent } from '../challenge-like/challenge-like.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-challenge-details',
  imports: [CommonModule, RouterModule, AddCommentComponent, RouterLink, ChallengeLikeComponent],
  standalone: true,
  templateUrl: './challenge-details.component.html',
  styleUrls: ['./challenge-details.component.css']
})
export class ChallengeDetailsComponent implements OnInit {
  challenge: Challenge | undefined;
  challengeId: number = 0;
  isLoading: boolean = true;
  isJoining: boolean = false; 
  comments: Comment[] = [];


showCommentForm: boolean = true;    // ✅ שדה חדש: להצגת הודעת ההצלחה
    commentSuccessMessage: string | null = null;

  constructor(
    private commentService: CommentService,  
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private router: Router,
    private cdr: ChangeDetectorRef    
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idParam = params['id'] || params['challengeId'];
      if (idParam) {
        this.challengeId = +idParam;
        this.getChallengeDetails();
        this.loadComments();
      } else {
        console.error('Challenge ID not found in URL');
        this.isLoading = false;
      }
    });
  }

  getChallengeDetails(): void {
    this.challengeService.getChallengeById(this.challengeId).subscribe({
      next: (data) => {
        this.challenge = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load challenge details', err);
        this.isLoading = false;
      }
    });
  }
onLikeStatusUpdated(status: { newCount: number; isLiked: boolean }) {
  if (this.challenge) {
    // שורה 1: מעדכנים את האובייקט בצורה immutable (חובה!)
    this.challenge = {
      ...this.challenge,
      likeCount: status.newCount,
      isLikedByCurrentUser: status.isLiked
    };

    // שורה 2: מודיעים לאנגולר במפורש "תבדוק שוב עכשיו!" (ליתר ביטחון)
    this.cdr.markForCheck();        
    this.cdr.detectChanges();       
  }
}

  toggleCommentForm(): void {
    this.showCommentForm = !this.showCommentForm;
  }

  onCommentAddedSuccess(): void {
    this.loadComments(); // טוען את התגובה החדשה
    
    // ✅ שלב 1: הצגת הודעת ההצלחה
    
    // ✅ שלב 2: איפוס הטופס (על ידי הסתרתו לרגע והחזרתו)
    // הערה: מכיוון ש-`app-add-comment` אינו משנה את עצמו, 
    // הדרך הטובה ביותר לאפס אותו היא להסתירו ולחשוף אותו מחדש.
    //this.showCommentForm = false; 
    
    // ✅ שלב 3: הסתרת הודעת ההצלחה והצגת הטופס מחדש לאחר 3 שניות
    setTimeout(() => {
        this.commentSuccessMessage = null; // מסתיר את ההודעה
       // this.showCommentForm = true; // מחזיר את תיבת הטקסט (טופס)
        this.cdr.detectChanges();  // ודא שהתצוגה מתעדכנת (חובה לאחר שימוש ב-setTimeout)
    }, 3000);
  }

  joinChallenge(): void {
    if (this.isJoining || !this.challengeId) return;
    this.isJoining = true;

    this.challengeService.joinChallenge(this.challengeId).subscribe({
      next: (response) => {
           Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "הצטרפת לאתגר בהצלחה!", 
                  showConfirmButton: false,
                  timer: 3000 // 3 שניות
                });
        console.log('Join Success:', response);
        this.isJoining = false;
        this.router.navigate(['/my-challenges']); 
      },
      error: (err) => {
        this.isJoining = false;
        const errorMessage = err.error || 'שגיאה בהצטרפות. אנא ודא שאתה מחובר.';
        if (err.status === 400 && errorMessage.includes('כבר הצטרף')) {
                Swal.fire({
                  position: "top-end",
                  icon: "error",
                  title: " הנך כבר מצורף לאתגר זה", 
                  showConfirmButton: false,
                  timer: 3000 // 3 שניות
                });
        } else if (err.status === 401 || err.status === 403) {
                Swal.fire({
                  position: "top-end",
                  icon: "error",
                  title: " עליך להתחבר כדי להצטרף לאתגר.", 
                  showConfirmButton: false,
                  timer: 3000 // 3 שניות
                });
        } else {
          alert(`שגיאה בהצטרפות: ${errorMessage}`);
        }
        console.error('Join Error:', err);
      }
    });
  }

  loadComments(): void {
    this.commentService.getCommentsByChallengeId(this.challengeId)
      .subscribe({
        next: (data) => {
          this.comments = data;
          console.log('Comments loaded:', data);
        },
        error: (e) => {
          console.error('Error fetching comments:', e);
        }
      });
  }
}
