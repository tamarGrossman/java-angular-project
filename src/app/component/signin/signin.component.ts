// signin.component.ts

import { Component } from '@angular/core';
import { usersService } from '../../service/users.service';
import { Users } from '../../models/users.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


// אם דרוש ניווט, יש לייבא את Router
 //import { Router } from '@angular/router'; 

@Component({
  selector: 'app-signin',
  imports: [
    FormsModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  
  user: Users = { username: '', password: '' };
  message: string = '';
  isLoggedIn: boolean = false;
  currentUsername: string = ''; 

  constructor(private usersService: usersService , private router: Router) {
    this.usersService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);

    this.usersService.currentUser$.subscribe(username => {
        this.currentUsername = username;
    });
  }

  
  signin(): void {
    if (!this.user.username || !this.user.password) {
      this.message = 'אנא מלא שם משתמש וסיסמה';
      return;
    }

    this.usersService.signin(this.user).subscribe({
      
      next: (response: string) => { 
        console.log('התחברת בהצלחה:', response);
        
        if (response.startsWith("אתה כבר מחובר כ-")) {
             this.message = response; 
             this.isLoggedIn = true;
        } else {
             this.message = `התחברת בהצלחה! שלום ${response}`;
        }
        
        setTimeout(() => { 
            this.router.navigate(['/']); 
        }, 2000); 
      },

      // 4. כישלון:
      error: (err) => {
        console.error('שגיאה בהתחברות:', err);

        if (err.status === 403 || err.status === 401) {
          this.message = 'שם המשתמש או הסיסמה שגויים';
        } else if (err.status === 404) {
          this.message = 'משתמש לא קיים';
        } else {
          this.message = err.error || 'שגיאה לא צפויה. נסה שוב.';
        }
      }
    });
  }
}