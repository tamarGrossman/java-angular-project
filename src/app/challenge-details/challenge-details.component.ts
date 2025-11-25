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

  // ⬅️ משתנה חדש לשליטה בהצגת הטופס
  showCommentForm: boolean = true; 

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.challengeId = +idParam;
      this.getChallengeDetails();
    } else {
      console.error('Challenge ID not found in URL');
      this.isLoading = false;
    }
  }

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
  onCommentAddedSuccess(): void {
    this.showCommentForm = false; // מסתיר את הטופס לאחר שליחה
    // 💡 יש להוסיף קריאה לפונקציה שתטען מחדש את רשימת התגובות
    // לדוגמה: this.loadComments(); 
    console.log('תגובה נוספה בהצלחה, מרענן את הרשימה (אם הלוגיקה קיימת).');
  }

  joinChallenge(): void {
    // ... לוגיקת הצטרפות קיימת ...
  }
}