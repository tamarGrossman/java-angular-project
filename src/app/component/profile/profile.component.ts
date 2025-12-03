import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Users } from '../../models/users.model'; // ✅ ודאי שהנתיב למודל נכון
import { usersService } from '../../service/users.service'; 
import { Subscription } from 'rxjs'; // ✅ לניהול ה-Subscription

@Component({
  selector: 'app-profile',
  standalone: true,
  // ייבוא RouterLink עבור קישורים ב-HTML ו-CommonModule עבור מבני בקרה
  imports: [RouterLink, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  currentUserId: number| null = null; 
  isLoading: boolean = true;
  currentUsername: string | null = null; 
  private subscription!: Subscription;
currentUser: Users | null = null;
  constructor(private router: Router, private userService: usersService) { }
  ngOnInit(): void {
    // 💡💡💡 שינוי קריטי: הרשמה ל-currentUser$
    this.subscription = this.userService.currentUser$.subscribe(username => {
        this.currentUsername = username;
        // כדאי לבדוק אם יש שם משתמש כדי לדעת אם סיימת לטעון (במקום ה-isLoading הנוכחי)
        // אבל נשאיר את ה-isLoading הנוכחי כמו שהוא כדי לא לשנות יותר מדי
        if (this.currentUsername && this.currentUsername !== '') {
            this.isLoading = false;
        } else {
             // אם המשתמש לא מחובר או השם לא נטען, המשתמש צריך לחכות
            this.isLoading = false; // או להישאר true אם מצפים שנטען אותו מחדש
        }
    });

    // ככל הנראה, תרצה לשלוף את ה-ID כאן גם
    // this.isLoading = false; 
  }
  
  // 💡 מומלץ: ביטול ההרשמה בעת השמדת הקומפוננטה
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * פונקציית ניווט כללית לפי נתיב.
   * @param routePath הנתיב הבסיסי לניווט (למשל, 'my-challenges')
   */
}
