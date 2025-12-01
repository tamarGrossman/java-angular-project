import { Component } from '@angular/core';
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
export class AppComponent {
  title = 'challenge';
  // ✅ משתנה לשליטה בהצגה/הסתרה של חלון הצ'אט
  isChatOpen: boolean = false; 

  // ✅ פונקציה לפתיחה/סגירה בלחיצת כפתור
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }
  
  // ✅ פונקציה לסגירה (נקראת כשהמשתמש לוחץ על X בחלון הצ'אט)
  closeChatWindow(): void {
    this.isChatOpen = false;
}
}