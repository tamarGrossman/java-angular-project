import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Users } from '../../models/users.model'; // ✅ ודאי שהנתיב למודל נכון

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

currentUser: Users | null = null;
  constructor(private router: Router) { }
ngOnInit(): void {
    // בדרך כלל, כאן תתרחש לוגיקת טעינה/אימות של הפרופיל.
    // נניח לשם הדוגמה שהטעינה הסתיימה מייד.
    this.isLoading = false;
  }

  /**
   * פונקציית ניווט כללית לפי נתיב.
   * @param routePath הנתיב הבסיסי לניווט (למשל, 'my-challenges')
   */
}
