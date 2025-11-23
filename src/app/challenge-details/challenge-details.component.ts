import { Component, OnInit } from '@angular/core';
import { Challenge } from '../models/challenge.model';
import { ChallengeService } from '../service/challenge.service';
import { ActivatedRoute, Router } from '@angular/router'; // ⬅️ הוספנו Router
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-challenge-details',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './challenge-details.component.html',
  styleUrl: './challenge-details.component.css'
})
export class ChallengeDetailsComponent implements OnInit {
  challenge: Challenge | undefined;
  challengeId: number = 0;
  isLoading: boolean = true;
  isJoining: boolean = false; // ⬅️ דגל חדש למניעת לחיצות כפולות

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private router: Router // ⬅️ הזרקת ה-Router
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
      },
      error: (err) => {
        console.error('Failed to load challenge details', err);
        this.isLoading = false;
        // לוגיקה לטיפול באתגר שלא נמצא
        this.router.navigate(['/challenges']); // ⬅️ ניווט חזרה אם האתגר לא קיים
      }
    });
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