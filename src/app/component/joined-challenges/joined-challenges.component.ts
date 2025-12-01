import { Component } from '@angular/core';
import { ChallengeService } from '../../service/challenge.service';
import { Router } from '@angular/router';
import { Challenge } from '../../models/challenge.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-joined-challenges',
  imports: [RouterLink],
  templateUrl: './joined-challenges.component.html',
  styleUrl: './joined-challenges.component.css'
})
export class JoinedChallengesComponent {
joinedChallenges: Challenge[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // הוספת Router ל-Constructor
  constructor(
    private challengeService: ChallengeService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.loadJoinedChallenges();
  }

  loadJoinedChallenges(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.challengeService.getJoinedChallenges()
      .subscribe({
        next: (challenges) => {
          this.joinedChallenges = challenges;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching joined challenges:', error);
          this.errorMessage = 'אירעה שגיאה בטעינת רשימת האתגרים.';
          this.isLoading = false;
        }
      });
  }

  /**
   * פונקציה לניווט לדף פרטי האתגר
   * @param challengeId ה-ID של האתגר אליו רוצים לנווט
   */
navigateToDetails(id: number | undefined) {
    if (id !== undefined) {
      // ✅ תיקון קריטי: הפסיק מפריד בין הנתיב לפרמטר
      this.router.navigate(['/challenge', id]); 
    }
  }
}

