// all-challenge.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Challenge } from '../../models/challenge.model';
import { ChallengeService } from '../../service/challenge.service';
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
  // *** קוד חדש למוטיבציה ***
motivationPhrases: string[] = [
    "🏆 ההצלחה שלך מחכה לך, רק תתחילי בצעד הראשון!",
    " את יכולה לעשות את זה! האמונה בעצמך היא הכוח הגדול ביותר. 💪",
    " אל תפחדי מכישלון – הוא חלק מהדרך לצמיחה. 🌱",
    " היום זה היום לצאת מאזור הנוחות שלך ✨.",
    " התמדה היא המפתח. המשיכי הלאה! 🧭",
  ];
  
  currentMotivationPhrase: string = this.motivationPhrases[0]; 
  
  // משתנה בוליאני לשליטה על אנימציית הכניסה/יציאה (Angular class binding)
  isPhraseVisible: boolean = true;

  constructor(private challengeService: ChallengeService) { }

  ngOnInit(): void {
    this.challengeService.getAllChallenges().subscribe({
      next: (res) => {
        this.challengeList = res; 
      },
      error: (err) => {
        console.error("Error fetching challenges:", err);
      }
      // ניתן להוסיף גם complete: () => { /* לוגיקה לאחר סיום */ }
    });
      this.startMotivationRotation();
    
  }
startMotivationRotation(): void {
    let index = 0;
    const intervalTime = 4000; // 4 שניות לכל מחזור כניסה/יציאה
    
    setInterval(() => {
        // שלב 1: העלמה (הזזה ימינה)
        this.isPhraseVisible = false;
        
        // שלב 2: החלפת המשפט לאחר זמן קצר (כדי להספיק לראות את היציאה)
        setTimeout(() => {
            index = (index + 1) % this.motivationPhrases.length;
            this.currentMotivationPhrase = this.motivationPhrases[index];
            
            // שלב 3: כניסה (הזזה שמאלה)
            this.isPhraseVisible = true;
        }, 500); // 500ms לוקח לאנימציה לצאת
        
    }, intervalTime); 
  }
}

  /**
   * מקבל מחרוזת Base64 ובונה את מחרוזת ה-Data URL שנדרשת לתג <img>.
   * @param base64String מחרוזת Base64 של התמונה.
   * @returns Data URL או מחרוזת ריקה.
   */

