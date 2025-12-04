import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Comment } from '../models/comment.model'; 

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = 'http://localhost:8080/api/comment'; 

  constructor(private http: HttpClient) { }


  addCommentToChallenge(challengeId: number, formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/add/${challengeId}`;
    return this.http.post(url, formData, { withCredentials: true }); 
  }

getCommentsByChallengeId(challengeId: number): Observable<Comment[]> {
    const url = `${this.baseUrl}/getByChallenge/${challengeId}`;
        return this.http.get<Comment[]>(url);
  }
  getUserComments(): Observable<Comment[]> {
    const url = `${this.baseUrl}/my-comments`;
    
    return this.http.get<Comment[]>(url, { withCredentials: true } );
  }
}
