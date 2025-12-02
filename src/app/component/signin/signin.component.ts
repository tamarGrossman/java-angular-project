// signin.component.ts

import { Component } from '@angular/core';
import { usersService } from '../../service/users.service';
import { Users } from '../../models/users.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


// אם דרוש ניווט, יש לייבא את Router
 //import { Router } from '@angular/router'; 

@Component({
  selector: 'app-signin',
  imports: [
    FormsModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  
  user: Users = { username: '', password: '' };
  message: string = '';
  isLoggedIn: boolean = false;
  currentUsername: string = ''; // המשתנה שמחובר ל-HTML

  // הוסף את Router אם אתה משתמש בו לניווט
  constructor(private usersService: usersService , private router: Router) {
    // 1. הרשמה לסטטוס ההתחברות
    this.usersService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);

    // 💡💡💡 שינוי קריטי: האזנה לשם המשתמש מה-Service 💡💡💡
    this.usersService.currentUser$.subscribe(username => {
        // המשתנה הזה יתעדכן אוטומטית כשה-Service מעדכן אותו.
        this.currentUsername = username;
    });
  }

  /**
   * פונקציה להתחברות - גרסה נקייה יותר
   */
  signin(): void {
    // 1. בדיקת תקינות בסיסית
    if (!this.user.username || !this.user.password) {
      this.message = 'אנא מלא שם משתמש וסיסמה';
      return;
    }

    // 2. קריאה לשירות עם האובייקט 'user' השלם
    this.usersService.signin(this.user).subscribe({
      
      // 3. הצלחה: ה-Service כבר עדכן את isLoggedIn ו-currentUsername!
      next: (response: string) => { 
        console.log('התחברת בהצלחה:', response);
        
        // בדיקה אם השרת החזיר את הודעת ה"כבר מחובר"
        if (response.startsWith("אתה כבר מחובר כ-")) {
             this.message = response; 
             this.isLoggedIn = true; // עדכון מצב מקומי
        } else {
             // אם השרת החזיר רק את שם המשתמש (התחברות ראשונה)
             this.message = `התחברת בהצלחה! שלום ${response}`;
        }
        
        // 🛑 שינוי קריטי: ניווט אוטומטי לדף הבית לאחר 3 שניות (3000ms)
        setTimeout(() => { 
            this.router.navigate(['/']); 
        }, 2000); 
      },

      // 4. כישלון:
      error: (err) => {
        console.error('שגיאה בהתחברות:', err);
        // ... (טיפול בשגיאות נשאר כפי שהיה)
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