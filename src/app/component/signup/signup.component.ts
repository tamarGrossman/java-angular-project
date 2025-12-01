import { Component } from '@angular/core';
import { Users } from '../../models/users.model';
import { usersService } from '../../service/users.service';
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
    next: (response) => {
        console.log('הרישום בוצע בהצלחה:', response);
        this.message = `הרישום בוצע בהצלחה! ברוך הבא, ${response}`;
    },
    error: (err) => {
    console.error('שגיאה ברישום:', err);

    // בדיקה לפי קוד סטטוס HTTP
    if (err.status === 409) {
        // סטטוס 409: שם המשתמש כבר קיים במאגר
        this.message = err.error || 'שם משתמש זה כבר קיים במערכת.';
    } else if (err.status === 403) {
        // סטטוס 403: מנסה להירשם בזמן שהוא כבר מחובר
        this.message = err.error ;
    } else {
        // כל שגיאה אחרת (400 כללי, 500 וכו')
        this.message = 'שגיאה כללית ברישום. נסה שוב.';
    }
}
});
}
}