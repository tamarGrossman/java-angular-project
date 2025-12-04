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
    
  
     
    uploadChallenge(challengeData: Challenge, imageFile?: File | null): Observable<Challenge>{
      const formData = new FormData();
  
      if (imageFile) {
        formData.append('image', imageFile, imageFile.name);
      }
      formData.append('challenge', new Blob([JSON.stringify(challengeData)], {
        type: 'application/json'
      }));
        return this.http.post<Challenge>(`${this.baseUrl}/create`, formData,{withCredentials: true})
      ;
    }

  joinChallenge(challengeId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/join/${challengeId}`, null, {
        withCredentials: true,
        responseType: 'text' 
    });
}
  

  getMyCreatedChallenges(): Observable<Challenge[]> {
        const httpOptions = {
        headers: new HttpHeaders({ 
            'Content-Type': 'application/json' 
        }),
        withCredentials: true 
    };
    const url = `${this.baseUrl}/uploadedBy`; 
        return this.http.get<Challenge[]>(url, httpOptions);
  }

// קבלת אתגרים למשתמש שהצטרף אליהם
getJoinedChallenges(): Observable<Challenge[]> {
    const fullUrl = `${this.baseUrl}/joinedChallenges`;
        return this.http.get<Challenge[]>(fullUrl, {
      withCredentials: true 
    });
  }
addLikeChallenge(challengeId: number): Observable<any> { 
    const url = `${this.baseUrl}/addLike/${challengeId}`; 
    
    return this.http.post(url, {}, { 
        withCredentials: true,
    });
}

getPopularChallenges(limit?: number): Observable<Challenge[]> {
  return this.http.get<Challenge[]>(`${this.baseUrl}/popular`, { withCredentials: true });
}
}