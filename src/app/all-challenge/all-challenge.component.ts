// all-challenge.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Challenge } from '../models/challenge.model';
import { ChallengeService } from '../service/challenge.service';
import { CommonModule} from '@angular/common'; 
// אין צורך לייבא את OnInit שוב, הוא כבר שם

@Component({
  selector: 'app-all-challenge',
  imports: [HttpClientModule, CommonModule],
  standalone: true,
  templateUrl: './all-challenge.component.html',
  styleUrl: './all-challenge.component.css'
})
export class AllChallengeComponent implements OnInit{

  challengeList: Challenge[] = []; 
  // הגדרת סוג ה-MIME הקבוע. שנה אם סוגי התמונות משתנים (לדוגמה: 'image/png')
  private readonly IMAGE_MIME_TYPE = 'image/*'; 

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
  getImageSource(base64String: string | undefined): string {
    if (base64String) {
      // בונה Data URL: "data:<mime-type>;base64,<base64-data>"
      return `data:${this.IMAGE_MIME_TYPE};base64,${base64String}`;
    }
    return ''; // מחזיר ריק אם אין נתונים
  }
}