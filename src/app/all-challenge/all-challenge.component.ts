// all-challenge.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Challenge } from '../models/challenge.model';
import { ChallengeService } from '../service/challenge.service';
import { CommonModule} from '@angular/common'; 
import { RouterModule } from '@angular/router';
// אין צורך לייבא את OnInit שוב, הוא כבר שם

@Component({
  selector: 'app-all-challenge',
  imports: [HttpClientModule,CommonModule,RouterModule],
  standalone: true,
  templateUrl: './all-challenge.component.html',
  styleUrl: './all-challenge.component.css'
})
export class AllChallengeComponent implements OnInit{

  challengeList: Challenge[] = []; 

  constructor(private challengeService: ChallengeService) { }

  ngOnInit(): void {
    this.challengeService.getAllChallenges().subscribe({
      next: (res) => {
        this.challengeList = res; 
      },
      error: (err) => {
        console.error("Error fetching challenges:", err);
      }
    });
  }

  /**
   * מקבל מחרוזת Base64 ובונה את מחרוזת ה-Data URL שנדרשת לתג <img>.
   * @param base64String מחרוזת Base64 של התמונה.
   * @returns Data URL או מחרוזת ריקה.
   */

}