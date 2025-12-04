import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../models/users.model';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class usersService {
private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn.asObservable(); //  למעקב בקומפוננטות
  private _currentUser = new BehaviorSubject<string>(''); // 💡💡💡 שינוי קריטי 1: הוספת משתנה גלובלי לשם משתמש
   public currentUser$ = this._currentUser.asObservable();  
  message: string | undefined;
  public forceSignOutLocal() {
    this._isLoggedIn.next(false);
    this._currentUser.next(''); //  ניקוי שם המשתמש בהתנתקות כפויה
  }
    constructor(private http:HttpClient,private router: Router) {
    this.checkAuthStatus();
  }
  private baseUrl='http://localhost:8080/api/users';

signup(user: Users): Observable<string> {
    
    const signupData = {
        username: user.username,
        email: user.email, 
        password: user.password
    };
    
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true 
    };
    return this.http.post(
        `${this.baseUrl}/signup`,
        signupData,
        { ...httpOptions, responseType: 'text' as 'json' } 
    ) as Observable<string>; 
}

signin(user: Users): Observable<string> {
    
    const signinData = {
        username: user.username,
        password: user.password
    };

    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json' 
        }),
        withCredentials: true,  
        responseType: 'text' as 'json' 
    };

  return this.http.post<string>( 
        `${this.baseUrl}/signin`,
        signinData,
        { ...httpOptions, responseType: 'text' as 'json' }
    ).pipe(
        tap((response: string) => {
            this._isLoggedIn.next(true); 
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
            this._currentUser.next('');
            console.log('Signout successful:', message);
        })
    ); 
}
checkAuthStatus(): void {
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true 
    };
    
    this.http.get<boolean>(`${this.baseUrl}/is-logged-in`, httpOptions).pipe(
        catchError(error => {
            console.warn('Authentication status check failed (Defaulting to false):', error);
            return of(false); 
        }),
        tap(status => {
            this._isLoggedIn.next(status);
            
            if (!status) {
                this._currentUser.next('');
            }
        })
    ).subscribe(); 
}

getCurrentUsername(): Observable<string> {
    return this.currentUser$;
}
public setLoggedInStatus(username: string): void {
    if (username && username.trim() !== '') {
        this._isLoggedIn.next(true);
        this._currentUser.next(username);
    }
  }
 }