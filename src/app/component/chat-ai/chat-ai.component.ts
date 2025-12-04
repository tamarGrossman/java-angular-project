import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatResponse, ChatService } from '../../service/chat.service';
import { FormsModule } from '@angular/forms';
import {  Message } from '../../models/chat.model';
@Component({
  selector: 'app-chat-ai',
  imports: [FormsModule],
  templateUrl: './chat-ai.component.html',
  styleUrl: './chat-ai.component.css'
})


export class ChatAIComponent {
messages: Message[] = [];
  currentMessage: string = '';
  conversationId: string = `chat-${Date.now()}`; // מזהה שיחה ייחודי לשימור זכרון
  isLoading: boolean = false;

  @Input() isVisible: boolean = false; // קלט: שולט בהצגה/הסתרה של החלון
  @Output() closeChat = new EventEmitter<void>(); // פלט: מאפשר להורה לסגור את החלון

  currentBotMessageIndex: number = -1; // אינדקס להודעת הבוט הנוכחית שנבנית

  constructor(private chatService: ChatService) { 
    this.messages.push({ content: " היי! אני ה-AI שלך בתחום כושר, תזונה ובריאות. אם אתה מתלבט איזה אתגר לבחור, שתף אותי במטרות ובשאיפות שלך ואני אכוון אותך לאתגר המושלם. כמובן, אני כאן גם לכל שאלה אחרת!", isUser: false });
  }

  sendMessage(): void {
    const userMessage = this.currentMessage.trim();

    if (!userMessage || this.isLoading) { return; }

    // 1. הוספת הודעת המשתמש
    this.messages.push({ content: userMessage, isUser: true });
    
    // 2. הכנה להודעת הבוט - דוחפים אובייקט ריק
    this.messages.push({ content: '', isUser: false });
    this.currentBotMessageIndex = this.messages.length - 1; 
    
    this.isLoading = true;
    this.currentMessage = ''; 

    // 3. קריאה ל-Service והאזנה לזרם הנתחים (Chunks)
    this.chatService.sendMessageStream(userMessage, this.conversationId)
      .subscribe({
        next: (chunk: ChatResponse) => {
          if (this.currentBotMessageIndex !== -1) {
             this.messages[this.currentBotMessageIndex].content += chunk.message; // ✅ שימוש בשם הנכון
          }
        },
        error: (err) => {
          console.error('שגיאה בתקשורת עם שירות ה-AI:', err);
          if (this.currentBotMessageIndex !== -1) {
            this.messages[this.currentBotMessageIndex].content = 'אירעה שגיאה בחיבור לשרת ה-AI.';
          }
          this.isLoading = false;
          this.currentBotMessageIndex = -1; 
        },
        complete: () => {
          // 4. סיום ההזרמה
          this.isLoading = false;
          this.currentBotMessageIndex = -1; 
        }
      });
  }

  onClose(): void {
    this.closeChat.emit();
  }
}

