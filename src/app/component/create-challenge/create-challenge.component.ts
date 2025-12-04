import { Component } from '@angular/core';
import { Challenge } from '../../models/challenge.model';
import { ChallengeService } from '../../service/challenge.service';
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
    date: new Date(), 
    numOfDays: 0,
    userId: 0,
    likeCount: 0,
    isLikedByCurrentUser: false
  };
  selectedFile: File | null = null;
  uploading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private challengeService: ChallengeService) { }


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

 

    this.uploading = true;

    this.challengeService.uploadChallenge(this.newChallenge, this.selectedFile).subscribe({
      next: (response) => {
        this.successMessage = `האתגר "${response.name}" נוצר בהצלחה!`;
        this.uploading = false;
        // איפוס טופס
        this.newChallenge = {
          name: '',
          userName:'',
          description: '',
          date: new Date(),
          numOfDays: 0,
          userId: 1 ,
          likeCount: 0,
          isLikedByCurrentUser: false
        };
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('שגיאה בהעלאת האתגר:', err);
        this.errorMessage = 'אירעה שגיאה במהלך העלאת האתגר. אנא נסה שוב.';
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'שגיאת אימות: עליך להיות מחובר כדי להעלות אתגר.'; // 💡 שורה שונתה
        } else {
          this.errorMessage = 'אירעה שגיאה במהלך העלאת האתגר. אנא נסה שוב.';
        }
        this.uploading = false;
      }
    });
  }
}
