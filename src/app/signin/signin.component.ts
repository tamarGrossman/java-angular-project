import { Component } from '@angular/core';
import { usersService } from '../service/users.service'; // הנתיב שלך
import { Users } from '../models/users.model';       // הנתיב שלך
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // נדרש עבור *ngIf וכו' ב-standalone

@Component({
  selector: 'app-signin',
  imports: [
    FormsModule,   // מאפשר [(ngModel)]
    CommonModule   // מאפשר *ngIf, *ngFor וכו'
  ],
  standalone: true,
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  
  user: Users = { username: '', password: '' };
  message: string = '';
  isLoggedIn: boolean = false;

  constructor(private usersService: usersService) {
    // הרשמה לסטטוס ההתחברות מהשירות
    // (isLoggedIn ישמש להצגה/הסתרה של הטופס ב-HTML)
    this.usersService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
  }

  /**
   * פונקציה להתחברות - גרסה מתוקנת
   */
  signin(): void {
    // 1. בדיקת תקינות בסיסית
    if (!this.user.username || !this.user.password) {
      this.message = 'אנא מלא שם משתמש וסיסמה';
      return;
    }

    // 2. קריאה לשירות עם האובייקט 'user' השלם
    // 2. קריאה לשירות עם האובייקט 'user' השלם
    this.usersService.signin(this.user).subscribe({
      
      // 3. הצלחה: 'response' מכיל את שם המשתמש *או* הודעת "כבר מחובר"
      next: (response: string) => { 
        console.log('התחברת בהצלחה:', response);
        
        // בדיקה אם השרת החזיר את הודעת ה"כבר מחובר"
        if (response.startsWith("אתה כבר מחובר כ-")) {
             this.message = response; 
             this.isLoggedIn = true; // עדכון מצב מקומי
        } else {
             // אם השרת החזיר רק את שם המשתמש (התחברות ראשונה)
             this.message = `התחברת בהצלחה! שלום ${response}`;
             // השירות אמור כבר לעדכן את isLoggedIn$
        }
      },

      // 4. כישלון: (בלוק ה-error נשאר כפי שסיפקת אותו לאחרונה)
      error: (err) => {
        console.error('שגיאה בהתחברות:', err);

        // ניתוח סוג השגיאה
        if (err.status === 403 || err.status === 401) {
          this.message = 'שם המשתמש או הסיסמה שגויים';
        } else if (err.status === 404) {
          this.message = 'משתמש לא קיים';
        } else {
          this.message = err.error || 'שגיאה לא צפויה. נסה שוב.';
        }
      }
    });
  }
}

  // פונקציה להתחברות
/*signin(): void {
  // קודם נוודא ששדות מלאים
  if (!this.user.username || !this.user.password) {
    this.message = 'אנא מלא שם משתמש וסיסמה';
    return;
  }

  this.usersService.signin(this.user).subscribe({
    next: (response) => {
      console.log('התחברת בהצלחה:', response);
      this.message = 'התחברת בהצלחה!';
    },
    error: (err) => {
      console.error('שגיאה בהתחברות:', err);

      // ניתוח סוג השגיאה לפי status או message מהשרת
      if (err.status === 403) {
        // Forbidden - יכול להיות שהשם משתמש לא קיים או הסיסמה לא נכונה
        if (err.error && err.error.message) {
          this.message = err.error.message; // הודעה ספציפית מהשרת
        } else {
          this.message = 'שם המשתמש או הסיסמה שגויים';
        }
      } else if (err.status === 401) {
        // Unauthorized - כנראה המשתמש כבר מחובר או לא מורשה
        this.message = 'המשתמש כבר מחובר או אין הרשאה';
      } else if (err.status === 404) {
        this.message = 'משתמש לא קיים';
      } else {
        this.message = 'שגיאה לא צפויה. נסה שוב.';
      }
    }
  });
}*/
