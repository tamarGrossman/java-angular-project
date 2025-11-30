import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Challenge } from '../models/challenge.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

    constructor(private http:HttpClient) {}
    private baseUrl = 'http://localhost:8080/api/challenges';
    
    getAllChallenges():Observable<Challenge[]>{
      return this.http.get<Challenge[]>(`${this.baseUrl}/getAll`);
    }
    getChallengeById(id: number): Observable<Challenge> {
      return this.http.get<Challenge>(`${this.baseUrl}/getById${id}`);
    }
    
    /**
     * 💡 פונקציה מעודכנת לשליחת נתונים בפורמט FormData
     * @param challengeData נתוני האתגר
     * @param imageFile קובץ התמונה (File)
     */
    uploadChallenge(challengeData: Challenge, imageFile: File): Observable<Challenge>{
      // 1. יצירת אובייקט FormData
      const formData = new FormData();
  
      // 2. הוספת קובץ התמונה תחת המפתח "image"
      // תואם ל- @RequestPart("image") ב-Java
      formData.append('image', imageFile, imageFile.name);
  
      // 3. הוספת נתוני האתגר כאובייקט JSON תחת המפתח "challenge"
      // תואם ל- @RequestPart("challenge") ב-Java
      // ממירים את אובייקט ה-Challenge למחרוזת JSON באמצעות Blob
      formData.append('challenge', new Blob([JSON.stringify(challengeData)], {
        type: 'application/json'
      }));
  
      // 4. שליחת הבקשה לפונקציה createChallenge
      return this.http.post<Challenge>(`${this.baseUrl}/create`, formData,{withCredentials: true})
      ;
    }
  joinChallenge(challengeId: number): Observable<any> {
    // ⬅️ הוספנו { responseType: 'text' } כדי לצפות למחרוזת
    return this.http.post(`${this.baseUrl}/join/${challengeId}`, null, {
        withCredentials: true,
        responseType: 'text' // <--- התיקון הקריטי
    });
}
  

  getMyCreatedChallenges(): Observable<Challenge[]> {
    
    // חיוני: withCredentials: true כדי לשלוח את ה-Cookie/Session Token
    const httpOptions = {
        headers: new HttpHeaders({ 
            'Content-Type': 'application/json' 
        }),
        withCredentials: true 
    };
    
    const url = `${this.baseUrl}/uploadedBy`; // 👈 שימוש בנתיב החדש
    
    // ביצוע קריאת ה-GET. אנו מצפים לקבל רשימת ChallengeDto
    return this.http.get<Challenge[]>(url, httpOptions);
  }
// קבלת אתגרים למשתמש שהצטרף אליהם
getJoinedChallenges(): Observable<Challenge[]> {
    const fullUrl = `${this.baseUrl}/joinedChallenges`;
    
    // 💡 הוספת withCredentials: true
    return this.http.get<Challenge[]>(fullUrl, {
      withCredentials: true 
    });
  }
  }
