import { Component } from '@angular/core';
import { Challenge } from '../models/challenge.model';
import { ChallengeService } from '../service/challenge.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-challenge',
  imports: [FormsModule,CommonModule],
  standalone: true, 
  templateUrl: './create-challenge.component.html',
  styleUrl: './create-challenge.component.css'
})
export class CreateChallengeComponent {
  newChallenge: Challenge = {
    name: '',
    userName:'',
    description: '',
    date: new Date(), // ערך ברירת מחדל
    numOfDays: 0,
    userId: 1 // **חשוב:** החלף ב-ID המשתמש האמיתי שצריך להגיע מהלוגין/אפליקציה
  };
  selectedFile: File | null = null;
  uploading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private challengeService: ChallengeService) { }

  /**
   * לוכד את הקובץ שנבחר על ידי המשתמש
   * @param event אירוע שינוי הקלט (input change event)
   */
  onFileSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = null;
    }
  }

  /**
   * מטפל בשליחת הטופס
   */
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.selectedFile) {
      this.errorMessage = 'אנא בחר קובץ תמונה.';
      return;
    }

    this.uploading = true;

    // קורא לשירות עם נתוני האתגר והקובץ שנבחר
    this.challengeService.uploadChallenge(this.newChallenge, this.selectedFile).subscribe({
      next: (response) => {
        this.successMessage = `האתגר "${response.name}" נוצר בהצלחה!`;
        this.uploading = false;
        // אפס טופס
        this.newChallenge = {
          name: '',
          userName:'',
          description: '',
          date: new Date(),
          numOfDays: 0,
          userId: 1
        };
        this.selectedFile = null;
        // איפוס הקלט של הקובץ ב-HTML אם צריך
      },
      error: (err) => {
        console.error('שגיאה בהעלאת האתגר:', err);
        this.errorMessage = 'אירעה שגיאה במהלך העלאת האתגר. אנא נסה שוב.';
        this.uploading = false;
      }
    });
  }
}
