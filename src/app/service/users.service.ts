import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../models/users.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class usersService {
private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn.asObservable(); // אובזרבלא למעקב בקומפוננטות
  private _currentUser = new BehaviorSubject<string>(''); // 💡💡💡 שינוי קריטי 1: הוספת משתנה גלובלי לשם משתמש
   public currentUser$ = this._currentUser.asObservable();  // 💡💡💡
  message: string | undefined;
  public forceSignOutLocal() {
    this._isLoggedIn.next(false);
    this._currentUser.next(''); // 💡 ניקוי שם המשתמש בהתנתקות כפויה
  }
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
/*
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
        { ...httpOptions, responseType: 'text' as 'json' }
    ).pipe(
        tap((response: string) => {
            this._isLoggedIn.next(true); 
            
            // 💡💡💡 שינוי קריטי 2: שמירת שם המשתמש הגלובלי 💡💡💡
            // אנו מניחים שהשרת מחזיר את שם המשתמש עצמו (אם ההתחברות הצליחה)
            // או שהוא מחזיר מחרוזת מורכבת שצריך לנתח. נניח שהוא מחזיר את השם.
            const username = response.startsWith("אתה כבר מחובר כ-") 
                             ? response.replace("אתה כבר מחובר כ-", "").trim() 
                             : response.trim();
            this._currentUser.next(username); 
        })
    ); 
}


signout(): Observable<string> {
    
    const httpOptions = {
      headers: new HttpHeaders({ 'ContentType': 'application/json' }),
      withCredentials: true 
    };

    return this.http.post<string>( 
      `${this.baseUrl}/signout`,
      null, 
      { ...httpOptions, responseType: 'text' as 'json' } 
   ).pipe(
        tap((message: string) => { 
            this._isLoggedIn.next(false); 
            this._currentUser.next(''); // 💡💡💡 שינוי קריטי 3: ניקוי שם המשתמש
            console.log('Signout successful:', message);
        })
    ); 
}
  }