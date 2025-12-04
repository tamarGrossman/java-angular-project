import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Users } from '../../models/users.model'; // ✅ ודאי שהנתיב למודל נכון
import { usersService } from '../../service/users.service'; 
import { Subscription } from 'rxjs'; // ✅ לניהול ה-Subscription

@Component({
  selector: 'app-profile',
  standalone: true,
  // ייבוא RouterLink עבור קישורים ב-HTML ו-CommonModule עבור מבני בקרה
  imports: [RouterLink, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  currentUserId: number| null = null; 
  isLoading: boolean = true;
  currentUsername: string | null = null; 
  private subscription!: Subscription;
currentUser: Users | null = null;
  constructor(private router: Router, private userService: usersService) { }
  ngOnInit(): void {
    this.subscription = this.userService.currentUser$.subscribe(username => {
        this.currentUsername = username;
        if (this.currentUsername && this.currentUsername !== '') {
            this.isLoading = false;
        } else {
            this.isLoading = false; 
        }
    });

  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
