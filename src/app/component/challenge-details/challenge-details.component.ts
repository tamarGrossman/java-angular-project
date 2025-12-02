// src/app/components/challenge-details/challenge-details.component.ts

import { Component, OnInit } from '@angular/core';
import { Challenge } from '../../models/challenge.model';
import { ChallengeService } from '../../service/challenge.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { RouterLink } from '@angular/router';
import { CommentService } from '../../service/comment.service';
import { Comment } from '../../models/comment.model';
import { ChallengeLikeComponent } from '../challenge-like/challenge-like.component';

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

  showCommentForm: boolean = true; 

  constructor(
    private commentService: CommentService,  
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private router: Router
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

  // ⭐ השינוי הקריטי: סנכרון ה-like בזמן אמת
  onLikeStatusUpdated(status: { newCount: number; isLiked: boolean }) {
    console.log('[PARENT] onLikeStatusUpdated received', status);
    if (this.challenge) {
      this.challenge.likeCount = status.newCount;
      this.challenge.isLikedByCurrentUser = status.isLiked;
      console.log('[PARENT] challenge updated locally ->', { likeCount: this.challenge.likeCount, isLiked: this.challenge.isLikedByCurrentUser });
    }
  }

  toggleCommentForm(): void {
    this.showCommentForm = !this.showCommentForm;
  }

  onCommentAddedSuccess(): void {
    this.loadComments();
    console.log(`תגובה נוספה בהצלחה. מרענן את רשימת התגובות...`);
    setTimeout(() => {
        this.showCommentForm = false;
        console.log('מסתיר את טופס התגובה לאחר 3 שניות.');
    }, 3000);
  }

  joinChallenge(): void {
    if (this.isJoining || !this.challengeId) return;
    this.isJoining = true;

    this.challengeService.joinChallenge(this.challengeId).subscribe({
      next: (response) => {
        alert('הצטרפת לאתגר בהצלחה!');
        console.log('Join Success:', response);
        this.isJoining = false;
        this.router.navigate(['/my-challenges']); 
      },
      error: (err) => {
        this.isJoining = false;
        const errorMessage = err.error || 'שגיאה בהצטרפות. אנא ודא שאתה מחובר.';
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
