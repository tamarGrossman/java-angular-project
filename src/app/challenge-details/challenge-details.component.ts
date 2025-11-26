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
  refreshTrigger: number = 0;

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
  // ✅ תיקון 3: שינוי הלוגיקה ב-onCommentAddedSuccess()
  onCommentAddedSuccess(): void {
    
    // 1. הגדלת הטריגר באופן מיידי - זה מרענן את רשימת התגובות
    this.refreshTrigger++;
    console.log(`9. [DETAILS] Comment added success received. Triggering refresh... Trigger: ${this.refreshTrigger}`);
    
    // 2. עטיפת הסתרת הטופס ב-setTimeout.
    // זה מאפשר ל-AddCommentComponent להציג את הודעת ההצלחה שלו ל-3 שניות
    // לפני שהרכיב (וההודעה) נמחק מהמסך.
    setTimeout(() => {
        this.showCommentForm = false; // הסתרת הטופס לאחר 3 שניות
        console.log('10. [DETAILS] Hiding comment form after 3 seconds.');
    }, 3000); 
    
    console.log('תגובה נוספה בהצלחה, מרענן את הרשימה (אם הלוגיקה קיימת).');
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
}
