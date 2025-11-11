import { Component } from '@angular/core';
import { Users } from '../models/users.model';
import { usersService } from '../service/users.service';
import { FormsModule } from '@angular/forms'; // ← זה חשוב
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup',
  imports: [CommonModule,FormsModule],
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

    user: Users = {
    
    username: '',
    email: '',
    password: ''
  };

  message = '';

  constructor(private usersService: usersService) {}

  onSubmit() {
    this.usersService.signup(this.user).subscribe({
      next: (res) => {
        this.message = 'ההרשמה בוצעה בהצלחה!';
        console.log(res);
      },
      error: (err) => {
        if (err.status === 400) {
          this.message = 'שם המשתמש כבר קיים במערכת.';
        } else {
          this.message = 'שגיאה בהרשמה, נסי שוב.';
        }
        console.error(err);
      }
    });
  }}