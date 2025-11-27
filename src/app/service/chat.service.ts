import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

export interface ChatRequest {
  message: string;
  conversationId: string;
}

export interface ChatResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private chatUrl = 'http://localhost:8080/api/challenges/chat'; 

  constructor(private zone: NgZone) { }

  sendMessageStream(message: string, conversationId: string): Observable<ChatResponse> {
    const data: ChatRequest = { message, conversationId };

    return new Observable(observer => {
      fetch(this.chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(data)
      })
      .then(async (response) => {
        if (!response.body || !response.ok) {
           observer.error('Network response was not ok');
           return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = ''; // ✅ משתנה לזיכרון זמני של חלקי שורות

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // פענוח הנתח הנוכחי והוספתו לבאפר
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          // פיצול לפי שורות חדשות
          const lines = buffer.split('\n');
          
          // שמירת החלק האחרון (שאולי הוא חצי שורה) לפעם הבאה
          buffer = lines.pop() || ''; 

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data:')) {
              try {
                const jsonStr = trimmedLine.replace('data:', '').trim();
                if (jsonStr) {
                  const parsedData = JSON.parse(jsonStr);
                  
                  // הדפסה ללוג כדי לוודא שזה מגיע בחלקים
                  console.log('נתח התקבל:', parsedData.message); 

                  this.zone.run(() => observer.next(parsedData));
                }
              } catch (e) {
                console.warn('Error parsing JSON chunk', e);
              }
            }
          }
        }
        this.zone.run(() => observer.complete());
      })
      .catch(err => {
        this.zone.run(() => observer.error(err));
      });
    });
  }
}