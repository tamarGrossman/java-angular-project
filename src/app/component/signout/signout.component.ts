import { Component, OnInit } from '@angular/core';
import { usersService } from '../../service/users.service';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-signout',
  imports: [],
  standalone:true,
  templateUrl: './signout.component.html',
  styleUrl: './signout.component.css'
})
export class SignoutComponent implements OnInit{
message: string = '';
  isLoggedIn: boolean = true; // מצב התחברות מקומי

  constructor(private usersService: usersService) {}

  ngOnInit() {
  // בדיקה חד־פעמית אם המשתמש כבר מנותק
  this.usersService.isLoggedIn$.pipe(take(1)).subscribe(status => {
    this.isLoggedIn = status;
    if (!status) {
      this.message = 'את כבר מנותקת.';
    }
  });

    // 💡 פשוט מאזינים לשינויים במצב ההתחברות
    this.usersService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      // מנקה הודעה כשמצב משתנה (למשל, אחרי התחברות/התנתקות מוצלחת)
       if (status) {
      this.message = '';
    } 
    });
  }

  onSignout(): void {
    if (!this.isLoggedIn) {
      this.message = 'אתה כבר מנותק.';
      return;
    }

    this.message = 'מתבצעת התנתקות...';

    this.usersService.signout().subscribe({
      next: (response) => {
        // המצב המקומי (isLoggedIn) יעודכן אוטומטית ע"י ההאזנה ב-ngOnInit.
        this.message = 'התנתקת בהצלחה!';
        console.log('Client signout response:', response);
      },
     error: (err) => {
        console.error('Signout failed', err);
        this.message = 'אירעה שגיאה בעת ההתנתקות. נסה שוב.';
        
        // 💡💡💡 השתמש במתודה הציבורית החדשה 💡💡💡
    }});
}}
