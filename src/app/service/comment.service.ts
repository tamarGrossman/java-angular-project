// src/app/services/challenge.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  // חשוב: יש לשנות את כתובת ה-URL הבסיסית לכתובת ה-Backend שלך
  private baseUrl = 'http://localhost:8080/api/comment'; 

  constructor(private http: HttpClient) { }

  /**
   * שולח בקשת POST להוספת תגובה לאתגר ספציפי.
   *
   * @param challengeId ה-ID של האתגר אליו מוסיפים תגובה.
   * @param commentDto אובייקט CommentDto המכיל את התוכן והתמונה.
   * @returns Observable שמחזיר את תגובת השרת (הודעת הצלחה/שגיאה).
   */
  addCommentToChallenge(challengeId: number, comment: Comment): Observable<any> {
    // הנתיב המלא: /api/comment/{challengeId}
    const url = `${this.baseUrl}/add/${challengeId}`;

    // ה-Interceptor (אם מוגדר) יטפל אוטומטית בהוספת ה-Authorization Token
    // אם אין Interceptor, תצטרכי להוסיף את ה-Token באופן ידני כאן,
    // אך השימוש ב-Interceptor הוא הדרך המקובלת והטובה ביותר.

    // ה-HttpClient שולח את ה-commentDto כ-JSON בגוף הבקשה
    return this.http.post(url, comment,{withCredentials: true, responseType: 'text' }
);
  }

}