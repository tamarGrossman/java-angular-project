import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './component/nav/nav.component';
import { CommonModule } from '@angular/common';
import { ChatAIComponent } from './component/chat-ai/chat-ai.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,RouterOutlet,CommonModule,ChatAIComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// 🛑🛑🛑 שינוי 1: יישום OnInit 🛑🛑🛑
export class AppComponent implements OnInit { 
  title = 'challenge';
  
  // 🛑🛑🛑 שינוי 2: הגדרת המצב ההתחלתי ל-TRUE לפתיחה מיידית 🛑🛑🛑
  isChatOpen: boolean = true; 

  // משתנה פנימי ששומר אם המשתמש כבר סגר את הצ'אט בעצמו
  private hasUserClosed: boolean = false;

  // 🛑🛑🛑 שינוי 3: מתודת OnInit (מתבצעת עם טעינת הקומפוננטה) 🛑🛑🛑
  ngOnInit(): void {
    // בגלל ש-isChatOpen כבר מוגדר ל-true, החלון ייפתח אוטומטית.
    // אם תרצה שהפתיחה תהיה מבוססת על תנאי מסוים (למשל, לאחר טעינת נתונים), 
    // תוכל להשתמש כאן ב-setTimeout או בלוגיקה מורכבת יותר.
  }
  
  // ✅ פונקציה לפתיחה/סגירה בלחיצת כפתור
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    // אם המשתמש לוחץ על הכפתור, נסמן שהוא השתמש בצ'אט
    this.hasUserClosed = true;
  }
  
  // ✅ פונקציה לסגירה (נקראת כשהמשתמש לוחץ על X בחלון הצ'אט)
  closeChatWindow(): void {
    this.isChatOpen = false;
    this.hasUserClosed = true; // נסמן שהמשתמש סגר את הצ'אט
}
}