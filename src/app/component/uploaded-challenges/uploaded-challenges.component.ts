import { Component, OnInit } from '@angular/core';
import { Challenge } from '../../models/challenge.model';
import { Observable } from 'rxjs';
import { ChallengeService } from '../../service/challenge.service';
import{ChallengeDetailsComponent} from '../challenge-details/challenge-details.component';
import { AsyncPipe } from '@angular/common'; // 👈 חובה לייבא AsyncPipe
import { RouterLink } from '@angular/router'; // 👈 חובה לייבא RouterLink אם אתה משתמש ב-[routerLink]
import { DatePipe } from '@angular/common';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-uploaded-challenges',
  imports: [ChallengeDetailsComponent,AsyncPipe,RouterLink,DatePipe,SlicePipe],
  standalone: true,
  templateUrl: './uploaded-challenges.component.html',
  styleUrl: './uploaded-challenges.component.css'
})
//אתגרים שהעליתי


export class UploadedChallengesComponent implements OnInit {
  uploadedChallenges$!: Observable<Challenge[]>;
  loading: boolean = true;
  error: string = '';

  constructor(private challengeService: ChallengeService) {}

  ngOnInit(): void {
    // קריאה לפונקציה החדשה
    this.uploadedChallenges$ = this.challengeService.getMyCreatedChallenges();
    
    this.uploadedChallenges$.subscribe({
        next: (challenges) => {
            this.loading = false;
        },
        error: (err) => {
            this.loading = false;
            if (err.status === 401) {
                this.error = 'אינך מחובר או פג תוקף הסשן. אנא התחבר שוב.';
            } else {
                this.error = 'אירעה שגיאה בטעינת האתגרים.';
            }
            console.error('Failed to load created challenges', err);
        }
    });
  }
}
