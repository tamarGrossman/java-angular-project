// signup.component.ts

import { Component } from '@angular/core';
import { Users } from '../../models/users.model';
import { usersService } from '../../service/users.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-signup',
  imports: [CommonModule,FormsModule],
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  isLoggedIn: boolean = false;
  currentUsername: string = ''; 

  user: Users = {
    username: '',
    email: '',
    password: ''
  };

  message = '';

  constructor(private usersService: usersService, private router: Router) {
    this.usersService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    this.usersService.currentUser$.subscribe(username => {
        this.currentUsername = username;
    });
  }

  onSubmit() {
    this.usersService.signup(this.user).subscribe({
    next: (response) => {
        console.log('הרישום בוצע בהצלחה:', response);
        
        const usernameFromServer = response.replace(" נרשם וחובר בהצלחה!", "").trim(); 
        
        this.usersService.setLoggedInStatus(usernameFromServer);

        this.message = `הרישום והחיבור בוצעו בהצלחה. משתמש: ${usernameFromServer}`;
        
        setTimeout(() => { 
            this.router.navigate(['/']); 
        }, 6000); 

    },
    error: (err) => {
        console.error('שגיאה ברישום:', err);
        if (err.status === 409) {
            this.message = err.error || 'שם משתמש זה כבר קיים במערכת.';
        } else if (err.status === 403) {
            this.message = err.error ;
        } else {
            this.message = err.error || 'שגיאה כללית ברישום. נסה שוב.';
        }
    }
    });
  }
}