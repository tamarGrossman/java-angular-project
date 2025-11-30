import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
// ⬅️ ודאי ש-Comment מוגדר נכון או שהשתמשי ב-any אם לא מוגדר
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
   * @param commentDto אובייקט CommentDto המכיל את התוכן.
   * @returns Observable<any> (מכיוון שה-Backend מחזיר 201 ריק)
   */
// 💡 שינוי החתימה לקבלת FormData
  addCommentToChallenge(challengeId: number, formData: FormData): Observable<any> {
    // הנתיב המלא: /api/comment/add/{challengeId}
    const url = `${this.baseUrl}/add/${challengeId}`;

    // ✅ שליחה ישירה של ה-FormData. הדפדפן מגדיר אוטומטית את Content-Type
    // 💡 הערה: אם ה-Backend מחזיר 201 ריק, אנו מטפלים בזה ב-Component.
    return this.http.post(url, formData, { withCredentials: true }); 
  }

getCommentsByChallengeId(challengeId: number): Observable<Comment[]> {
    const url = `${this.baseUrl}/getByChallenge/${challengeId}`;
    
    // שליחת בקשת GET לשרת וציפייה למערך של אובייקטי Comment
    return this.http.get<Comment[]>(url);
  }
  getUserComments(): Observable<Comment[]> {
    // מכיוון שהאימות (ה-Cookie/Token) נשלח אוטומטית ע"י הדפדפן 
    // כחלק מה-HttpClient, אין צורך להעביר פרמטר אימות נוסף כאן.
    const url = `${this.baseUrl}/my-comments`;
    
    // אנו מצפים לקבל רשימה של CommentDto
    return this.http.get<Comment[]>(url, { withCredentials: true } );
  }
}
