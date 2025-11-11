import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../models/users.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class usersService {
   private _isLoggedIn = new BehaviorSubject<boolean>(false); // <-- כאן
  public isLoggedIn$ = this._isLoggedIn.asObservable(); // אובזרבלא למעקב בקומפוננטות
  message: string | undefined;
    constructor(private http:HttpClient,private router: Router) {}
  private baseUrl='http://localhost:8080/api/users';

signup(user: Users): Observable<string> {
    
    // ודא שאתה שולח רק את המידע הנחוץ
    const signupData = {
        username: user.username,
        email: user.email, // אם דרוש
        password: user.password
    };
    
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true 
    };

    // הפתרון לשגיאות הקריאה של גוף השגיאה:
    // 1. קריאה ל-post
    // 2. הוספת responseType: 'text' (מוכרח על ידי as 'json') כדי לפתור את שגיאת ה-ArrayBuffer.
    // 3. הכרחת הטיפוס הסופי ל-Observable<string>
    return this.http.post(
        `${this.baseUrl}/signup`,
        signupData,
        { ...httpOptions, responseType: 'text' as 'json' } 
    ) as Observable<string>; 
}



  // signup(user: Users): Observable<Users> {
  //   return this.http.post<Users>(`${this.baseUrl}/signup`, user, { withCredentials: true });
  // }
 /* signin(user: Users): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/signin`, user, {
      headers: headers,
      withCredentials: true // חשוב! כדי שיישלח ה-cookie מהשרת
    });
  }*/
/*signin(username: string, password: string) {
  return this.http.post(`${this.baseUrl}/signin`, { username, password }, { 
    withCredentials: true, 
    responseType: 'text' 
  }).pipe(
    tap({
      next: (res: string) => {
        this._isLoggedIn.next(true);
        this.message = `התחברת בהצלחה! שלום ${username}`;
      },
      error: (err: any) => {
        this._isLoggedIn.next(false);
        // אם השרת מחזיר טקסט במקום JSON
        const text = err.error ? err.error : 'שגיאה לא צפויה';
        this.message = text;
      }
    })
  );
}*/
/**
   * פונקציית התחברות תואמת לקוד ה-Java
   * @param user - אובייקט Users המכיל username ו-password
   */
signin(user: Users): Observable<string> {
    
    // אנו שולחים רק את השדות שהשרת צריך (username ו-password)
    const signinData = {
        username: user.username,
        password: user.password
    };

    // הגדרות הבקשה (Options)
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json' 
        }),
        // חיוני ביותר! מאפשר לדפדפן לקבל ולשמור את ה-Cookie מהשרת
        withCredentials: true,  
        // חיוני! מציין שהתגובה (Response Body) היא מחרוזת (string)
        responseType: 'text' as 'json' // <--- שינוי קריטי 1: השתמש ב-'json' או הסר את ה-`as 'text'`
    };

    // ביצוע קריאת ה-POST
    // ***שינוי קריטי 2: ציון הטיפוס <string> במפורש ב-post***
    return this.http.post<string>( 
        `${this.baseUrl}/signin`,
        signinData,
        // ה-HttpClient מקבל את כל ה-options כ-object אחד
        { ...httpOptions, responseType: 'text' as 'json' } // <--- תיקון סופי לשגיאת ה-ArrayBuffer
    );
}
}


