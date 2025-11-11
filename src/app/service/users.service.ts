import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../models/users.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class usersService {
  
    constructor(private http:HttpClient) {}
  private baseUrl='http://localhost:8080/api/users';
  signup(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.baseUrl}/signup`, user, { withCredentials: true });
  }

}
