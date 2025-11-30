import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; // 💡 ייבוא חובה ל-routerLink
import { Observable } from 'rxjs';
import { usersService } from '../service/users.service';
import { AsyncPipe } from '@angular/common'; // 👈 1. הוספת הייבוא הזה


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink,AsyncPipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  ngOnInit(): void {
  }
  title = 'chalengesproject';
  
  // משתנה Observable שמשקף את סטטוס ההתחברות.
  // נשתמש ב- | async ב-HTML.
  isLoggedIn$: Observable<boolean>; 

  constructor(private usersService: usersService) {
    // השמת המשתנה הציבורי מהשירות.
    this.isLoggedIn$ = this.usersService.isLoggedIn$;
  }
}
