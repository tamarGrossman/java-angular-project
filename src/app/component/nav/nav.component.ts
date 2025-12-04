import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; // 💡 ייבוא חובה ל-routerLink
import { Observable } from 'rxjs';
import { usersService } from '../../service/users.service';
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
  
  
  isLoggedIn$: Observable<boolean>; 
//משמשמש כדי לדעת מה לשים בניווט 
  constructor(private usersService: usersService) {
    this.isLoggedIn$ = this.usersService.isLoggedIn$;
  }
}
